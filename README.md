[![Open in Cloud Shell](http://gstatic.com/cloudssh/images/open-btn.svg)](https://console.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https%3A%2F%2Fgithub.com%2Ffriendtree16%2Ftwilio-transcription)

# Node.js Twilio voice transcription sample for Google App Engine

This sample shows how to use [Twilio](https://www.twilio.com)([in Japan](https://twilio.kddi-web.com/)) on
[Google App Engine](https://cloud.google.com/appengine) Node.js [standard environment](https://cloud.google.com/appengine/docs/standard/nodejs)
and [flexible environment](https://cloud.google.com/appengine/docs/flexible/nodejs)

For more information about Twilio, see the
[Twilio Node library](https://www.twilio.com/docs/node/install).

## Setup

Before you can run or deploy the sample, you will need to do the following:

1. [Create a Twilio Account](http://ahoy.twilio.com/googlecloudplatform)([in Japan](https://jp.twilio.com/try-twilio/kddi-web)).

1. Create a number on twilio, and configure the voice request URL to be
`https://twilio-transcription-sample-dot-<your-project-id>.appspot.com/call/receive` .
