var express = require("express");
var bodyParser = require("body-parser");
var VoiceResponse = require('twilio').twiml.VoiceResponse;

var app = express();
var port = (process.env.PORT || 4000);

app.use(bodyParser.urlencoded())

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
    console.log("request.headers: ", request.headers);
    console.log("request.query: ", request.query);
    console.log("request.body: ", request.body); //body is comming as empty object

    var phone = request.body.From;
    var input = request.body.RecordingUrl;
    var twiml = new VoiceResponse();
    console.log("phone, input: ", phone, input);

    say('What type of podcast would you like to listen', twiml);
    twiml.record({
        method: 'POST',
        action: '/record/action',
        transcribeCallback: '/record/transcribe',
        maxLength: 10
    });
    respond(response, twiml);
});

app.post("/record/action", function (request, response, next) {
    console.log("/record/action");
    console.log("request.headers: ", request.headers);
    console.log("request.query: ", request.query);
    console.log("request.body: ", request.body); //body is comming as empty object

    var twiml = new VoiceResponse();

    say('please wait.', twiml);
    twiml.pause();
    twiml.redirect('/record/action');

    respond(response, twiml);
});

app.post("/record/transcribe", function (request, response, next) {

    console.log("/record/transcribe");

    console.log("request.headers: ", request.headers);
    console.log("request.query: ", request.query);
    console.log("request.body: ", request.body); //body is comming as empty object


    var phone = request.body.From;
    var input = request.body.RecordingUrl;
    var twiml = new VoiceResponse();

    var transcript = request.body.TranscriptionText;

    console.log("transcribe text: ", transcript);

    say('start playing.', twiml);
    say(transcript, twiml);

    // var mp3Url = 'https://api.twilio.com/cowbell.mp3'
    // twiml.play(mp3Url);

    respond(response, twiml);
});

app.listen(port, function () {
    console.log('app is running on port', port);
});