'use strict';

// Your first function handler
module.exports.hello = (event, context, cb) => {
  cb(null, { message: 'inzi, Your First Serverless Lambda Function is Up and Running on AWS Microwave Service!' });
};
module.exports.world = (event, context, cb) => {
  cb(null, { message: 'function executed successfully - POST!', event });
};

// You can add more handlers here, and reference them in serverless.yml
