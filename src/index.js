import {initializeApp} from 'firebase/app';
import {getMessaging,getToken} from 'firebase/messaging'


const MDCBanner = mdc.banner.MDCBanner;
const dialogCode = new mdc.dialog.MDCDialog(document.getElementById('code_doalog_id'));
const helpCode = new mdc.dialog.MDCDialog(document.getElementById('help_doalog_id'));
const dialogNotify = new mdc.dialog.MDCDialog(document.getElementById('notifiction_dialog_id'));
const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));

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
        const message = JSON.parse(JSON.parse(payload).msg_payload);
        if(message.clicked_action){
          processEvent(message.clicked_action);
        }else{
              openNotificationDialog(message);
        }
        window.history.pushState({}, document.title, "/" + "");
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
  
  if(event.data?.clicked_action){
    processEvent(event.data.clicked_action);
  }else{
    document.querySelector('bell-component').ringBell();
    setTimeout(function () {openNotificationDialog(event.data)}, 1200);
  }
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




//Dialog message box
function openNotificationDialog(message){
  console.log('Notification Message:',message);
  document.getElementById('dialog-title').innerHTML = message.title;
  document.getElementById('notification_body').innerHTML = message.body;
  
  const imgBox = document.getElementById('notification_image');
  imgBox.style.display = 'none';
  imgBox.src = '';
  
  if(message.image && message.image.length > 1){
    imgBox.src = message.image;
    imgBox.style.display = '';
    document.getElementById('image_container').style.class="mdc-image-list__image-aspect-container";
  }
  const notData = document.getElementById('notifcation_data_container');
  notData.style.display = 'none';
  notData.style.class="";
  if(message.data){
    document.getElementById('notifcation_data_text').value =    JSON.stringify(message.data);
    notData.style.display = ''
  }
  const like = document.getElementById('notification_action_like');
  const dislike = document.getElementById('notification_action_dislike');
  like.style.display = 'none';
  dislike.style.display = 'none';
  if(message.actions && message.actions.length > 0){
    like.style.display = '';
    dislike.style.display = '';
  }
 dialogNotify.open();
}

window.openNotificationDialog = openNotificationDialog;

dialogNotify.listen('MDCDialog:closed', (event) => {
  const action = event.detail.action;
  processEvent(action);
});


function processEvent(action){
  if(action == 'like-action'){
      showSnackBar("You have liked 👍 the Notfication ");
  }
  else if(action == 'dislike-action'){
    showSnackBar("You have disliked 👎 the Notfication ");
  }
  else if (action === 'dismiss') {
    showSnackBar("You have dismissed the Notification");
  }
}

window.processEvent = processEvent;

function openHelpDialog(){
  helpCode.open();
}
openHelpDialog.openHelpDialog = openHelpDialog;


