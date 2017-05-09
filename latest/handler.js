'use strict';

var AWS = require('aws-sdk');
var request = require("request");
var parseXmlToJson = require('xml2js').parseString;
var mongoose = require("mongoose");

AWS.config.update({ region: 'us-east-1' });

mongoose.connect("mongodb://dbuser:dbuser@ds131041.mlab.com:31041/podcastdb");

var Schema = mongoose.Schema;
var sch = new Schema({
  client: String,
  title: String
});
var model = mongoose.model('channels', sch);

// helper function for return fullfilment to bot
function fullfill(context, fulfilmentMessage) {
  context.succeed({
    "dialogAction": {
      "type": "Close",
      "fulfillmentState": "Fulfilled",
      "message": {
        "contentType": "PlainText",
        "content": fulfilmentMessage
      }
    }
  })
}


// lex fulfilment webhook
module.exports.webhook = (event, context, callback) => {
  try {

    console.log("event: ", event);

    var category = event.currentIntent.slots['category']; //religion, sports, politics, business, music, education
    var intentName = event.currentIntent.name
    console.log("intent name: ", category);
    console.log("slot: ", category);
    var regex = new RegExp(category, 'i');

    model.find({
      $or: [
        { "Title": regex },
        { "Description": regex },
        { "Category": regex },
        { "Keywords": { $exists: true } },
        { "Image": regex },
        { "Author": regex },
        { "Link": regex },
        { "Feed": regex }]
    },
      function (err, _data) {
        if (!err) {
          if (!_data || !_data.length) {

            console.log("mongodb: no channel found for category " + category);
            fullfill(context, "mongodb: no channel found for category " + category)

          } else {
            var data = JSON.parse(JSON.stringify(_data));//simplified object

            console.log("data: ", data.length);
            var choose = rand(0, data.length - 1)
            console.log("choosed: ", choose);

            var feedUrl = data[choose]["Feed"];
            console.log("Feed: ", feedUrl);
            request(feedUrl,
              function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  
                  // some time we are getting bad data structure so we catch that error here
                  try {

                    var xmlbody = body.toString();
                    // console.log("body: ", xmlbody);
                    parseXmlToJson(xmlbody, function (err, json) {
                      console.log(json);

                      console.log("items length: ", json.rss.channel[0].item['length']);
                      // console.log("items: ", JSON.stringify(json.rss.channel[0].item));
                      var items = json.rss.channel[0].item;

                      var choosedItem = rand(0, items.length - 1);
                      console.log("choosed item: ", choosedItem);

                      var podcastUrl = items[choosedItem].enclosure[0].$.url;
                      console.log(podcastUrl)

                      fullfill(context, podcastUrl)
                    });
                  } catch (e) {
                    console.log("bad data structure found");
                    fullfill(context, "bad data structure found")
                  }

                } else {
                  console.log("unable to get podcasts from randomly selected channel: ", error);
                  fullfill(context, "unable to get podcasts from randomly selected channel")
                }
              })
          }
        } else {
          console.log("mongodb: unknown error while finding channels for category " + category);
          fullfill(context, "mongodb: unknown error while finding channels for category " + category)
        }
      });

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  } catch (e) {
    console.log("catch: ", e);
  }
};


//exposed rest api of lex
module.exports.say = (event, context, callback) => {
  var lexruntime = new AWS.LexRuntime();

  console.log("event: ", event);
  console.log("event.body: ", event.body);
  console.log("event.body.text: ", event.body.text);

  var text = event.body.text
  console.log("text: ", text);

  var params = {
    botAlias: 'prod', /* required */ //you will get an alias name when you release your bot build
    botName: 'podcastbot', /* required */ //it is just name of your bot
    inputText: text, /* required */ //the text you want to say to bot
    userId: 'STRING_VALUE', /* required */ //unique user id, so bot can identify each user at runtime
    sessionAttributes: {
      '<String>': 'STRING_VALUE',
      /* '<String>': ... */
    }
  };

  lexruntime.postText(params, function (err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      const response = {
        statusCode: 500,
        body: err,
      };
      context.succeed(response);
    } else {
      console.log(data);           // successful response
      const response = {
        statusCode: 200,
        body: data,
      };
      context.succeed(response);
    }
  });
}


// // helper to append a new "Say" verb with alice voice
// function say(text) {
//   twiml.say({ voice: 'alice' }, text);
// }

// // respond with the current TwiML content
// function respond(context) {
//   context.succeed(twiml.toString());
// }

  // var AWS = require("aws-sdk");
  // AWS.config.update({
  //   region: "us-west-2",
  // });
  // var docClient = new AWS.DynamoDB.DocumentClient()
  // var params = {
  //   TableName: "Music",
  //   Key: {
  //     Artist: "abc"
  //   }
  // };
  // docClient.get(params, function (err, data) {
  //   if (err) {
  //     console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
  //   } else {
  //     console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
  //   }
  // });

  // To respond bot
  // callback(null, {
  //   "dialogAction": {
  //     "type": "Close",
  //     "fulfillmentState": "Fulfilled",
  //     "message": {
  //       "contentType": "PlainText",
  //       "content": "message to convey to the user"
  //     }
  //   }
  // })

  // To repond rest api
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Go Serverless v1.0! Your function executed successfully!',
  //     // input: event,
  //   }),
  // };
  // callback(null, response);

  // var datastructure = {
  //   "_id": "5909fd819dc7462c80f215b9",
  //   "Title": "Battiti",
  //   "Description": "Magazine musicale dedicato al jazz, alla black music e alle altre musiche che si affacciano con sempre maggiore pertinenza nel panorama musicale e discografico.",
  //   "Category": "musica",
  //   "Keywords": null,
  //   "Image": "http://www.rai.it/dl/img/2016/01/1452614756571Battiti_1300px.JPG",
  //   "Author": "Rai Radio3",
  //   "Link": "www.battiti.rai.it",
  //   "Feed": "http://www.radio.rai.it/radio3/podcast/rssradio3.jsp?id=3030"
  // }

