var passfaq = {
     
    "types of passport" : {
        "answer": "There are three types of passport in India Ordinary Passport, Diplomatic Passport and Official Passport"
    }, 
    "contact information" : {
        "answer": "By visiting our website www.passportindia.gov.in,By calling call centre at 1800-258-1800,By visiting Helpdesk at your nearest Passport Seva Kendra "
    }, 
    "passport services" : {
        "answer": "Issue of Fresh Passport,Re-issue of Passport and Miscellaneous Service"
    },
    "apply passport" : {
       "answer":"Register through the Passport Seva Online Portal. (Click on Register Now link on the Home Page).Login to the Passport Seva Online Portal with the registered Login Id.Click Apply for Fresh Passport or Re-issue of Passport link.Fill in the required details in the form and submit." 
    },
    "passport" : {
        "answer": "an official document issued by a government, certifying the holder's identity and citizenship and entitling them to travel under its protection to and from foreign countries"
    },
    "office location": {
         "answer":"There are many locations"
    },
    "apply passport online":{
        "answer": "To apply online, you need to be a registered user. When you apply online, you also have an option to download an e-Form that you can fill offline and upload later on. For downloading the form you need not be a registered user, but for uploading the form you need to register yourself. To apply for a passport online , please click on Home. You can also upload the documents required for applying the passport. You should have the scanned copy of the documents."
    },
    "Passport office":{
        "answer":"Passport Offices (PO) are vested with the authority to issue passports, besides revocation and impounding and exercise control over the PSK(s) under them. They handle all back-end functions required for processing all passport applications. The POs are responsible for printing,lamination, dispatch of Passports, liaison with MEA Hqs, state /UT admn and police,PVR review, besides attending to establishment matters,legal cases, RTI cases and financial matters."
    },
    "call centre timing": {
         "answer":"For any information and suggestions on Passport services, please call at 1800-258-1800 (Toll Free) or write to us through accessing the feedback link on the Home Page.National Call Centre Timings for Citizen Service Executive Support: 8 AM to 10 PM and Automated Interactive Voice Response (IVRS) Support: 24 hours"
    },
    "application status":{
        "answer":"you can check the status of your application by calling at Call Centre at 1800-258-1800. You can talk to the Call Centre executive or punch your file no. into the IVR system to check your application status."
    },
    "fee":{
        "answer":"To know the fee details for ordinary passports, please click the Fee Calculator link on the Home page. No fee is required for Diplomatic/Official passports."
    }
}


// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
    
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

   /* if (event.session.application.applicationId !== "amzn1.ask.skill.84f9e6fe-f4fb-42e5-ab26-fee75337d14f") {
        context.fail("Invalid Application ID");
     }*/

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    getWelcomeResponse(callback)
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == "PassportSevaIntent") {
        handlePassportResponse(intent, session, callback)
    } else if (intentName == "AMAZON.YesIntent") {
        handleYesResponse(intent, session, callback)
    } else if (intentName == "AMAZON.NoIntent") {
        handleNoResponse(intent, session, callback)
    } else if (intentName == "AMAZON.HelpIntent") {
        handleGetHelpRequest(intent, session, callback)
    } else if (intentName == "AMAZON.StopIntent") {
        handleFinishSessionRequest(intent, session, callback)
    } else if (intentName == "AMAZON.CancelIntent") {
        handleFinishSessionRequest(intent, session, callback)
    } else {
        throw "Invalid intent"
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
    var speechOutput = "Welcome to Passport Seva Kendra! How can I help you?" 
    var reprompt = "Please ask your queries related to passport services."

    var header = "Passport Seva Center!"

    var shouldEndSession = false

    var sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    }

    callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))

}

function handlePassportResponse(intent, session, callback) {
    var passportquery = intent.slots.PassportFAQ.value.toLowerCase()

    if (!passfaq[passportquery]) {
        var speechOutput = "I am not familier with this query. Try to ask other queries."
        var repromptText = "Try asking about another question"
        var header = "Not Famous Enough"
    } else {
        var answer = passfaq[passportquery].answer
       // var skill = passfaq[passportquery].skill
        var speechOutput = capitalizeFirst(passportquery) + " " + answer //+ " and " + skill + ". Do you want to hear about more reindeer?"    
        var repromptText = "Do you have more queries?"
        var header = capitalizeFirst(passportquery)
    }

    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}

function handleYesResponse(intent, session, callback) {
    var speechOutput = "Great! Which is your next query?"
    var repromptText = speechOutput
    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession))
}

function handleNoResponse(intent, session, callback) {
    handleFinishSessionRequest(intent, session, callback)
}

function handleGetHelpRequest(intent, session, callback) {
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};
    }

    var speechOutput = "I can tell you answers about passport service related information " + 
    " Which information are you interested in? Remember, I can only give answer about one query at a time." 

    var repromptText = speechOutput

    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession))

}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye! Thank you for using Passport Seva Kendra!", "", true));
}


// ------- Helper functions to build responses for Alexa -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

function capitalizeFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}