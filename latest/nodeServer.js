var express = require("express");
var bodyParser = require("body-parser");
var VoiceResponse = require('twilio').twiml.VoiceResponse;

var app = express();
var port = (process.env.PORT || 4000);

app.use(bodyParser.json())

// helper to append a new "Say" verb with alice voice
function say(text, twimlRef) {
    twimlRef.say({ voice: 'alice' }, text);
}
// respond with the current TwiML content
function respond(responseRef, twimlRef) {
    responseRef.type('text/xml');
    responseRef.send(twimlRef.toString());
}

app.post("/voice", function (request, response, next) {
    console.log("request.body: ", request.body); //body is comming as empty object
    console.log("request.query: ", request.query);

    var phone = request.body.From;
    var input = request.body.RecordingUrl;
    var twiml = new VoiceResponse();
    console.log("phone, input: ", phone, input);

    say('What type of podcast would you like to listen. Press any key to finish.', twiml);
    twiml.record({
        method: 'POST',
        action: '/voice/transcribe',
        transcribeCallback: '/voice/transcribe',
        maxLength: 10
    });

    respond(response, twiml);
});

app.post("/voice/transcribe", function (request, response, next) {
    console.log("request: ", request.body); //body is comming as empty object
    console.log("request.query: ", request.query);

    var phone = request.body.From;
    var input = request.body.RecordingUrl;
    var twiml = new VoiceResponse();

    var transcript = request.body.TranscriptionText;

    console.log("transcribe text: ", transcript);
    var mp3Url = 'https://api.twilio.com/cowbell.mp3'

    say('start playing.', twiml);
    twiml.play(mp3Url);

    respond(response, twiml);
});

app.listen(port, function () {
    console.log('app is running on port', port);
});