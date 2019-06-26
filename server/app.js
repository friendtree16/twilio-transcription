'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const Firestore = require('@google-cloud/firestore');
const db = new Firestore();
const admin = require('firebase-admin');

const util = require('util');
const https = require('https');

const Twilio = require('twilio');

const { TwimlResponse } = Twilio;

const sayOption = { language: 'ja-JP' };

// [START gae_flex_twilio_receive_call]
app.post('/call/receive', (req, res) => {

  const resp = new Twilio.twiml.VoiceResponse();

  var recordingUrl = req.body.RecordingUrl;
  console.log(`RecordingUrl: ${recordingUrl}`);
  if (recordingUrl) {
    downloadData(recordingUrl, async function (err, data) {
      console.log(`Transcription: start`);
      var transcriptionText = await transcription(data);
      writeText(req.body.From, req.body.CallSid, transcriptionText);
      console.log(`Transcription: end`);
      resp.say(sayOption, '続いてお話してください。');
      resp.record({
        timeout: 2
      });

      res
        .status(200)
        .contentType('text/xml')
        .send(resp.toString());
    });
  } else {
    resp.say(sayOption, '文字起こしを開始します。');
    resp.record({
      timeout: 2
    });

    res
      .status(200)
      .contentType('text/xml')
      .send(resp.toString());
  }
});

// transcription
async function transcription(data) {

  // Creates a client
  const client = new speech.SpeechClient();

  // Reads a local audio file and converts it to base64
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
  return transcription;
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

// DB書込み
async function writeText(phoneNumber, callSid, text) {
  console.log('start write text');
  var userRef = await db.collection('users').where('phoneNumber', '==', phoneNumber).get();

  const textData = {
    callSid: callSid,
    text: text,
    timestamp: admin.firestore.Timestamp.now()
  }

  if (!userRef.empty) {
    console.log('userRef exist');
    const userData = userRef.docs[0].data();
    userData.texts.push(textData);
    await db.collection('users').doc(userRef.docs[0].id).set(userData);
  } else {
    console.log('userRef not exist');

    db.collection('users').add({
      phoneNumber: phoneNumber,
      texts: [
        textData
      ]
    }).then(ref => {
      console.log('Added document with ID: ', ref.id);
    }).catch(function (error) {
      console.error("Error writing document: ", error);
    });;
  }
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
