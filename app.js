'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');
const util = require('util');
const https = require('https');

const Twilio = require('twilio');

const { TwimlResponse } = Twilio;

// [START gae_flex_twilio_receive_call]
app.post('/call/receive', (req, res) => {

  var recordingUrl = req.body.RecordingUrl;
  console.log(`RecordingUrl: ${recordingUrl}`);
  if (recordingUrl) {
    transcription(recordingUrl);
  }

  const resp = new Twilio.twiml.VoiceResponse();
  resp.record({
    timeout: 2
  });

  res
    .status(200)
    .contentType('text/xml')
    .send(resp.toString());
});

// transcription
function transcription(url) {

  console.log(`Transcription: start`);

  // Creates a client
  const client = new speech.SpeechClient();

  // Reads a local audio file and converts it to base64
  downloadData(url, async function (err, data) {
    const audioBytes = data.toString('base64');

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 8000,
      languageCode: 'ja-JP',
    };
    const request = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
  });
}

// 音声ファイルダウンロード
function downloadData(url, callback) {
  https.get(url, res => {
    // Initialise an array
    const bufs = [];

    // Add the data to the buffer collection
    res.on('data', function (chunk) {
      bufs.push(chunk)
    });

    // This signifies the end of a request
    res.on('end', function () {
      // We can join all of the 'chunks' of the image together
      const data = Buffer.concat(bufs);

      // Then we can call our callback.
      callback(null, data);
    });
  })
    // Inform the callback of the error.
    .on('error', callback);
}


// Start the server
if (module === require.main) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });
}

exports.app = app;
