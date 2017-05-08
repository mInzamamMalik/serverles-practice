var express = require("express");
var bodyParser = require("body-parser");
var VoiceResponse = require('twilio').twiml.VoiceResponse;

var app = express();
var port = (process.env.PORT || 4000);

app.use(bodyParser.json())

app.post("/voice", function (request, response, next) {

    console.log("request: ", (request));

    var phone = request.body.From;
    var input = request.body.RecordingUrl;
    var twiml = new VoiceResponse();

    console.log("phone, input: ", phone, input);

    // helper to append a new "Say" verb with alice voice
    function say(text) {
        twiml.say({ voice: 'alice' }, text);
    }
    // respond with the current TwiML content
    function respond() {
        response.type('text/xml');
        response.send(twiml.toString());
    }

    say('Please record your response after the beep. Press any key to finish.');
    twiml.record({
        transcribe: true,
        transcribeCallback: '/voice/transcribe',
        maxLength: 10
    });

    respond();
});


app.post("/voice/transcribe", function (req, res, next) {
    console.log("request: ", JSON.stringify(req));

    var transcript = request.body.TranscriptionText;

});

app.listen(port, function () {
    console.log('app is running on port', port);
});