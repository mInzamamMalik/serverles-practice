var params = {
  botAlias: 'STRING_VALUE', /* required */
  botName: 'STRING_VALUE', /* required */
  inputText: 'STRING_VALUE', /* required */
  userId: 'STRING_VALUE', /* required */
  sessionAttributes: {
    '<String>': 'STRING_VALUE',
    /* '<String>': ... */
  }
};
lexruntime.postText(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});