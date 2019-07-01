# Node.js Twilio voice transcription sample for Google App Engine

This sample shows how to use [Twilio](https://www.twilio.com)([in Japan](https://twilio.kddi-web.com/)) on
[Google App Engine](https://cloud.google.com/appengine) Node.js [standard environment](https://cloud.google.com/appengine/docs/standard/nodejs)
and [flexible environment](https://cloud.google.com/appengine/docs/flexible/nodejs)

For more information about Twilio, see the
[Twilio Node library](https://www.twilio.com/docs/node/install).

## Setup

Before you can run or deploy the sample, you will need to do the following:

1. [Create a Twilio Account](http://ahoy.twilio.com/googlecloudplatform)([in Japan](https://jp.twilio.com/try-twilio/kddi-web)). Google
App Engine customers receive a complimentary credit for SMS messages and inbound
messages.

1. Create a number on twilio, and configure the voice request URL to be
`https://twilio-transcription-sample-dot-<your-project-id>.appspot.com/call/receive` .

## Running locally

Refer to the [appengine/README.md](../README.md) file for instructions on
running and deploying.

You can run the application locally to test the callbacks and SMS sending. You
will need to set environment variables before starting your application:

    npm start
