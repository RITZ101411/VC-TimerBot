const { TranscribeClient } = require("@aws-sdk/client-transcribe");
const { AWS_REGION } = require("../../config.json");
const REGION = AWS_REGION;

console.log(`Using AWS region: ${REGION}`);

const transcribeClient = new TranscribeClient({ region: REGION });

module.exports = transcribeClient;