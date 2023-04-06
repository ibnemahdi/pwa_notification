import {initializeApp} from 'firebase/app';
import {getMessaging,getToken, onMessage} from 'firebase/messaging'





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

const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
snackbar.open();

onMessage(messaging, (payload) => {
    
    console.log('Received',payload);
    //alert('Message received. ', payload);
    // ...
  });


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
    console.log("Version 7");
    registerSW();
    const payload = getJsonFromUrl();
    if(payload){
        console.log("Payload:",JSON.parse(JSON.parse(payload).msg_payload));
        //alert(JSON.parse(payload));
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
    alert(JSON.stringify(event.data));
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






