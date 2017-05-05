'use strict';

module.exports.webhook = (event, context, callback) => {

  var mongoose = require("mongoose");
  // mongoose.connect("mongodb://malikasinger:pakistan1@ds149049.mlab.com:49049/malikasinger-demo");

  console.log("event: ", event);
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

  var datastructure = {
    "_id": "5909fd819dc7462c80f215b9",
    "Title": "Battiti",
    "Description": "Magazine musicale dedicato al jazz, alla black music e alle altre musiche che si affacciano con sempre maggiore pertinenza nel panorama musicale e discografico.",
    "Category": "musica",
    "Keywords": null,
    "Image": "http://www.rai.it/dl/img/2016/01/1452614756571Battiti_1300px.JPG",
    "Author": "Rai Radio3",
    "Link": "www.battiti.rai.it",
    "Feed": "http://www.radio.rai.it/radio3/podcast/rssradio3.jsp?id=3030"
  }


  callback(null, {
    "dialogAction": {
      "type": "Close",
      "fulfillmentState": "Fulfilled",
      "message": {
        "contentType": "PlainText",
        "content": "message to convey to the user"
      }
    }
  })

};


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
