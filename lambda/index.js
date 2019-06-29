const Alexa = require('ask-sdk-core');
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');
const clothDatabase = require('./cloth-database');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {

        const attributesManager = handlerInput.attributesManager;
        let s3Attributes = await attributesManager.getPersistentAttributes() || {};

        let physicalAtt = [
            'height',
            'weight',
            'complexion'
        ];

        let missingAtt = [];

        for(let i=0; i<physicalAtt.length; i++) {
            if(!s3Attributes.hasOwnProperty(physicalAtt[i])) {
                missingAtt.push(physicalAtt[i]);
            }
        }

        let missingAskText = `Please tell me your`;

        for(let i=0; i<missingAtt.length; i++) {
            if(i===0)
                missingAskText += ` ${missingAtt[i]}`;
            else if(i === missingAtt.length-1)
                missingAskText += ` and ${missingAtt[i]}.`;
            else
                missingAskText += `, ${missingAtt[i]}`;

        }

        let tellAttributes = `Height is ${s3Attributes.height}, weight is ${s3Attributes.weight}, complexion is ${s3Attributes.complexion}. \n`;

        let speechText = `Hello, Welcome to Clothing Suggestions. \n`;

        if(missingAtt.length>0) {
            speechText += missingAskText;
        }
        else {
            attributesManager.setSessionAttributes({'physAtt':s3Attributes});
            speechText += `Let me help you in deciding your outfit. \n` + 
                            `Tell me, what are you dressing up for? Office, outdoor sports, or a party? `;
        }


        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const SetAttrIntentHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SetAttrIntent');
    },
    async handle(handlerInput) {
        let speechText = '';
        
        const attributesManager = handlerInput.attributesManager;
        let s3Attributes = await attributesManager.getPersistentAttributes() || {};
        console.log("s3attr: ");
        console.log(s3Attributes);
        console.log("\n");
        let slots = handlerInput.requestEnvelope.request.intent.slots;
        // console.log(slots);
        
        let setAttributes = {};
        let missingAtt = {
            'height':1,
            'weight':1,
            'complexion':1
        };

        for(let key in missingAtt) {
            if(!s3Attributes.hasOwnProperty(key) || !s3Attributes[key]) {
                missingAtt[key] = 0;
            }
        }
        
        if(slots.HeightSlot && slots.HeightSlot.value){
            s3Attributes.height = slots.HeightSlot.value;
            missingAtt['height'] = 1;
        }      
        if(slots.WeightSlot && slots.WeightSlot.value){
            s3Attributes.weight = slots.WeightSlot.value;
            missingAtt['weight'] = 1;
        }      
        if(slots.ComplexionSlot && slots.ComplexionSlot.value){
            s3Attributes.complexion = slots.ComplexionSlot.value;
            missingAtt['complexion'] = 1;
        }      
        
        let askAttrText = '';
        for(let key in missingAtt) {
            if(missingAtt[key]===0){
                askAttrText += ` ${key},`;
            }
        }
        
        if(askAttrText!==''){
            speechText = `Can you please tell me your` + askAttrText;
            speechText = speechText.slice(0,-1);
        }else{
            let persAttr = await attributesManager.getPersistentAttributes() || {}
            attributesManager.setSessionAttributes(persAttr);
            speechText += "Let me help you in deciding your outfit. \n Tell me, what are you dressing up for? Office, outdoor sports, or a party? ";
        }
        
        attributesManager.setPersistentAttributes(s3Attributes);
        await attributesManager.savePersistentAttributes();
        console.log(await attributesManager.getPersistentAttributes());

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
        
    }
};
const SuggestIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SuggestIntent';
    },
    async handle(handlerInput) {
        let factors = {};
        let speechText = "";
        
        const attributesManager = handlerInput.attributesManager;
        let sessattr = await attributesManager.getSessionAttributes();
        
        factors = sessattr.factors || {};
        
        if(Object.keys(factors).length===0){
            // first time in SuggestIntentHandler
            // assigning complexion and build in factors
            let physAtt = sessattr.physAtt;
            
            let bmi = (physAtt.weight*100)/((physAtt.height)*(physAtt.height));
            factors.complexion = physAtt.complexion;
            
            if(bmi<18.5) factors.build = 'slim';
            else if(bmi>=18.5 && bmi<25) factors.build = 'medium';
            else factors.build = 'heavy';
        }
        
        
        let slots = handlerInput.requestEnvelope.request.intent.slots;
        let occassionslot = slots.OccasionSlot;
        let timeslot =  slots.TimeSlot;
    
        if(occassionslot && occassionslot.value){
            // assigning occasion in factors 
            factors.occassion = occassionslot.value;
            sessattr.factors = factors;
            await attributesManager.setSessionAttributes(sessattr);
            speechText+=JSON.stringify(factors);
            speechText += "  What time of day is it?"; 
            
        }
        if(timeslot && timeslot.value){
            // assigning timeOfDay in factors 
            sessattr.factors = factors;
            await attributesManager.setSessionAttributes(sessattr);
            factors.timeOfDay = timeslot.value;
        }
        
        if(!factors.occassion && !factors.timeOfDay){
            // if no slot value is given
            speechText += "Can you please repeat?"
        }
        if(factors.timeOfDay && factors.occassion){
            // if both timeOfDay and occasion are obtained.
            
            let factorIndex = clothDatabase.factorIndex;
            let dressDB = clothDatabase.dressDB;
            let dressScore = [];
    
            for(let i=0; i<dressDB.length; i++) {
                let tempScore = 0;
                for(let j=0; j<factorIndex.length; j++) {
                    let factorName = factorIndex[j].name;
                    let factorVal = factorIndex[j][factors[factorName]];
            
                    tempScore 
                        += parseInt(dressDB[i][factorName][factorVal]);
                }
                dressScore.push({
                    arrIndex : i,
                    score : tempScore
                });
            }
    
            function comp(a, b) {
                if(isNaN(a.score) || isNaN(b.score))
                    return 1;
                    
                if(a.score < b.score)	
                    return 1;
                else if(a.score > b.score)
                    return -1;
                else
                    return 0;
            }
    
            dressScore.sort(comp);
            
            let colorScore = [];
            let colorDB = clothDatabase.colorDB;
    
            let colorFactors = Object.keys(colorDB[0]);
    
            for(let i=0; i<colorDB.length; i++) {
                let tempScore = 0;
                for(let j=1; j<colorFactors.length; j++) {
                    let fac = colorFactors[j];
                    tempScore +=
                        colorDB[i][fac][factors[fac]];
                }
                colorScore.push({
                        arrIndex : i,
                        score : tempScore
                });
            }
        
            colorScore.sort(comp);
            
        
            speechText=JSON.stringify(factors);
            speechText += " got all factors"; 
         
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();

    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again. \n` +
                            `Error message: ${error.message}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        SetAttrIntentHandler,
        SuggestIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .withPersistenceAdapter(
        new persistenceAdapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET})
    )
    .lambda();
