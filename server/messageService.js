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
      console.log("headers:",options);
  
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
        'token': 'eYjYamtHTLPAoRRZIkk8zw:APA91bEn1bo23Y24SFD3X3DL365nCCU2x809-vZ9odovLZZ5ERnw-zhTW_Ml68Ec_3jV_HovjR3LbFrkOeyYSVak_Ta-ZB3lh6EDuJ5i46Y5OjFKz2cqv7kYiGJyrkKEn4uifwK14Ri8',
        'notification': {
          'title': 'FCM Notification',
          'body': 'Notification from FCM',
          'actions': [
            {
              action: 'like-action',
              title: 'like 👍',
              type: 'button',
            },
            {
              action: 'dislike-action',
              type: 'button',
              title: 'dislike 👎',
            }
          ]
        }
      }
    };
  }


  const commonMessage = buildCommonMessage();
  console.log('FCM request body for message using common notification object:');
  console.log(JSON.stringify(commonMessage, null, 2));
  sendFcmMessage(buildCommonMessage());