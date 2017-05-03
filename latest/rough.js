var request = require("request");
var parseXmlToJson = require('xml2js').parseString;
var mongoose = require("mongoose");
mongoose.connect("mongodb://devuser:devuser@ds149049.mlab.com:49049/malikasinger-demo");
var Schema = mongoose.Schema;
var sch = new Schema({
    client: String,
    title: String
});
var model = mongoose.model('abcs', sch);
var query = "Music";
var regex = new RegExp("^" + query + "$", 'i');

model.find({ "Category": regex }, function (err, _data) {
    if (!err) {
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

                        console.log("items length: ", json.rss.channel[0].item.length);
                        // console.log("items: ", JSON.stringify(json.rss.channel[0].item));
                        var items = json.rss.channel[0].item;
                        var choosedItem = rand(0, items.length - 1);
                        console.log("choosed item: ", choosedItem);
                        console.log(items[choosedItem].enclosure[0].$.url)

                    });
                } else {
                    console.log("request error: ", error);
                }
            })


    } else {
        console.log("error: ", err);
    }
});

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// request('http://thispodcast.libsyn.com/rss',
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {

//             var xmlbody = body.toString();
//             console.log("body: ", xmlbody);

//             parseXmlToJson(xmlbody, function (err, json) {
//                 console.log(json);
//             });
//         } else {
//             console.log("error: ", error);
//         }
//     })