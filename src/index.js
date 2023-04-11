import {initializeApp} from 'firebase/app';
import {getMessaging,getToken} from 'firebase/messaging'


const firebaseApp = initializeApp(
    {
        apiKey: "AIzaSyD_KnWAbiVpJ5FMfQJcrJsNK90SmIitPNA",
        authDomain: "gppushtest-e4aaf.firebaseapp.com",
        projectId: "gppushtest-e4aaf",
        storageBucket: "gppushtest-e4aaf.appspot.com",
        messagingSenderId: "976621236675",
        appId: "1:976621236675:web:21e088cb1cd0f48e4c8d76",
        measurementId: "G-Z20BRYG0J2"
      }
);

const messaging = getMessaging();


function getJsonFromUrl() {
    const url = location.search;
    var query = url.substring(1);
    if(!query.includes("msg_payload")){
        return;
    }
    var result = {};
    query.split("&").forEach(function(part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return JSON.stringify(result);
  }
 
window.addEventListener('load', () => {
    console.log("Version 9");
    registerSW();
    const payload = getJsonFromUrl();
    if(payload){
        openNotificationDialog(JSON.parse(JSON.parse(payload).msg_payload));


    }
    //Notification Access
    if(Notification.permission != "granted"){
      document.getElementById("pushRequest").style.display = "";
    }else{
        requestPermission().then(data => {
            document.getElementById("notficationCode").value = data;
            document.getElementById("allowed_alert").style.display = "";
        });
    }

  });

  // Register the Service Worker
  async function registerSW() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator
              .serviceWorker
              .register('serviceworker.js').then((registration) => {
              });
            }
      catch (e) {
        console.log('SW registration failed',e);
      }
    }
  }
  
navigator.serviceWorker.onmessage=function(event){
  if(event.action){
    processEvent(event.action);
    return;
  }
   document.querySelector('bell-component').ringBell();
   setTimeout(function () {
    openNotificationDialog(event.data)
  }, 1200);
    
}

export default async function requestPermission() {
    console.log('Requesting permission...');
    return Notification.requestPermission().then( (permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        //serviceWorkerRegistration: registration
        return navigator.serviceWorker.getRegistration().then(function(registration) {
            return getToken(messaging, {serviceWorkerRegistration: registration,vapidKey: 'BMB9PzYcnzpUDKCfI2WCiCmC-OtV64dcmt-HufkRnIJ4HmwUMBDa_lntm7FeHbMNcloZJr-e5I2EBVORU-gn2AI' }).then((currentToken) => {
                if (currentToken) {
                    return currentToken; 
                } else {
                console.log('No registration token available. Request permission to generate one.');
                }
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
            });
        } );  

        }
    })
}

//Open Tokcen Code popup
function openShareBox(){
  dialogCode.open()
}
window.openShareBox=openShareBox;

function askPermission(){
  requestPermission().then(data => {
          if(data){
              document.getElementById("pushRequest").style.display = "none";
              document.getElementById("notficationCode").value = data;
              document.getElementById("allowed_alert").style.display = "";
              
          }else{
              alert('Access Denied');
          }
    
      });
}
window.askPermission=askPermission;

dialogCode.listen('MDCDialog:closed', (event) => {
  const action = event.detail.action;
  if (action === 'copy') {
    // Handle delete action
    navigator.clipboard.writeText(document.getElementById("notficationCode").value )
    showSnackBar("Token Copied to clipboard");
  } else if (action === 'cancel') {
    // Handle cancel action
  }
});

function sendNotfication(type, timeout){
  let data = {token:  document.getElementById("notficationCode").value ,type:type,delay:timeout};
  fetch("https://firebasepushtest.azurewebsites.net/", {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify(data)
  }).then(res => {
    console.log("Request complete!, response:", res);
  });
}

window.sendNotfication=sendNotfication;


function showSnackBar(text){
  document.getElementById('snackbar_text_id').innerHTML = text;
  snackbar.open();
}

window.showSnackBar=showSnackBar;