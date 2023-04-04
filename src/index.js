import {initializeApp} from 'firebase/app';
import {getMessaging,getToken, onMessage} from 'firebase/messaging'


sw.onmessage=function(event){
    console.log(event.data,document.getElementById(event.data));
}


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

onMessage(messaging, (payload) => {
    
    console.log('Received',payload);
    //alert('Message received. ', payload);
    // ...
  });



 
window.addEventListener('load', () => {
    console.log("Version 5");
    registerSW();
  });

  // Register the Service Worker
  async function registerSW() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator
              .serviceWorker
              .register('serviceworker.js').then((registration) => {
                
                  //messaging.useServiceWorker(registration);
                  

              // Request permission and get token.....
              });
      }
      catch (e) {
        console.log('SW registration failed',e);
      }
    }
  }


export default function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then( (permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        //serviceWorkerRegistration: registration
        navigator.serviceWorker.getRegistration().then(function(registration) {
            getToken(messaging, {serviceWorkerRegistration: registration,vapidKey: 'BMB9PzYcnzpUDKCfI2WCiCmC-OtV64dcmt-HufkRnIJ4HmwUMBDa_lntm7FeHbMNcloZJr-e5I2EBVORU-gn2AI' }).then((currentToken) => {
                if (currentToken) {
                // Send the token to your server and update the UI if necessary
                // ...
            
                document.getElementById("notifyId").innerHTML=currentToken; 
                console.log(currentToken)
                } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
                // ...
                }
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
                // ...
            });
        } );  

        }
    })
}






