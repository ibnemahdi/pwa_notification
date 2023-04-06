const https = require('https');
const { google } = require('googleapis');

//Project id here
const PROJECT_ID = 'gppushtest-e4aaf'; 
const HOST = 'fcm.googleapis.com';
const PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

function getAccessToken() {
    return new Promise(function(resolve, reject) {
      //Service Account private key file
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
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
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
        'token': 'c_ZNr94e84IhhfrXbfflgH:APA91bFsij4zRxhW6vDOseIizprYEHQywZSlOOJBRrWWiitqX1PBgZn0HC1Jb8ESfTsg6XNqX1d2IapWZmWm7PF5NPRQOpDy927dFvW0kGUu0sRRZTRtHGEnPDnz60TKZuEwHQDfVEkA',
        'notification': {
          'title': 'FCM Notification',
          'body': 'Notification from FCM'
          },
          'webpush':{
            "notification":{
                "actions":[
                {
                  "action": "like-action",
                  "title": "like 👍",
                  "type": "button"
                },
                {
                  "action": "dislike-action",
                  "title": "dislike 👎",
                  "type": "button"
                },
                ]

          }
      }
    }
    }
  }

  function delay(t, v) {
    return new Promise(resolve => setTimeout(resolve, t, v));
}

  const commonMessage = buildCommonMessage();
  console.log('FCM request body for message using common notification object:');
  console.log(JSON.stringify(commonMessage, null, 2));


  return delay(1000).then(function() {
    return   sendFcmMessage(buildCommonMessage());
});

  