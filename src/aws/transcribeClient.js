const { TranscribeClient } = require("@aws-sdk/client-transcribe");
require('dotenv').config();

const { AWS_REGION } = process.env;
const region = AWS_REGION;

console.log(`Using AWS region: ${region}`);

const transcribeClient = new TranscribeClient({ region: region });

module.exports = transcribeClient;