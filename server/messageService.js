const https = require('https');
const { google } = require('googleapis');


const PROJECT_ID = 'gppushtest-e4aaf';
const HOST = 'fcm.googleapis.com';
const PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

function getAccessToken() {
    return new Promise(function(resolve, reject) {
      const key = require('./serviceaccount.json');
      const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        SCOPES,
        null
      );
      jwtClient.authorize(function(err, tokens) {
        if (err) {
          reject(err);
          return;
        }
        resolve(tokens.access_token);
      });
    });
  }

  function sendFcmMessage(fcmMessage) {
    getAccessToken().then(function(accessToken) {
      const options = {
        hostname: HOST,
        path: PATH,
        method: 'POST',
        // [START use_access_token]
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
        // [END use_access_token]
      };
  
      const request = https.request(options, function(resp) {
        resp.setEncoding('utf8');
        resp.on('data', function(data) {
          console.log('Message sent to Firebase for delivery, response:');
          console.log(data);
        });
      });
  
      request.on('error', function(err) {
        console.log('Unable to send message to Firebase');
        console.log(err);
      });
  
      request.write(JSON.stringify(fcmMessage));
      request.end();
    });
  }
  function buildCommonMessage() {
    return {
      'message': {
        'token': 'eAHzXjNU4oBazAEuQSQwJf:APA91bE-con80AaG6M5ytXuSPzHSBfaCb9FZdxlWH_SU0x9rURSY2OtnP19Fz3cuK46mD3bsLU3VVpIgrwr_d8oovbGSW-Cmak-_Jucv3BBlEIl6WZnQ9YzgJLxk1GNHXElr1sHq42fa',
        'notification': {
          'title': 'FCM Notification',
          'body': 'Notification from FCM'
        }
      }
    };
  }


  const commonMessage = buildCommonMessage();
  console.log('FCM request body for message using common notification object:');
  console.log(JSON.stringify(commonMessage, null, 2));
  sendFcmMessage(buildCommonMessage());