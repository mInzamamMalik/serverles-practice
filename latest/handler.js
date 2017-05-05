'use strict';
var request = require("request");
var parseXmlToJson = require('xml2js').parseString;
var mongoose = require("mongoose");
mongoose.connect("mongodb://dbuser:dbuser@ds131041.mlab.com:31041/podcastdb");
var Schema = mongoose.Schema;
var sch = new Schema({
  client: String,
  title: String
});
var model = mongoose.model('channels', sch);



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

            console.log("mongodb: no data found for category " + category);
            context.succeed({
              "dialogAction": {
                "type": "Close",
                "fulfillmentState": "Fulfilled",
                "message": {
                  "contentType": "PlainText",
                  "content": "mongodb: no data found for category " + category
                }
              }
            })

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

                    context.succeed({
                      "dialogAction": {
                        "type": "Close",
                        "fulfillmentState": "Fulfilled",
                        "message": {
                          "contentType": "PlainText",
                          "content": podcastUrl
                        }
                      }
                    })

                  });
                } else {
                  console.log("request error: ", error);
                }
              })
          }
        } else {
          console.log("find error: ", err);
        }
      });

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  } catch (e) {
    console.log("catch: ", e);
  }
};

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

