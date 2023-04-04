/*importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyD_KnWAbiVpJ5FMfQJcrJsNK90SmIitPNA",
    authDomain: "gppushtest-e4aaf.firebaseapp.com",
    projectId: "gppushtest-e4aaf",
    storageBucket: "gppushtest-e4aaf.appspot.com",
    messagingSenderId: "976621236675",
    appId: "1:976621236675:web:21e088cb1cd0f48e4c8d76",
    measurementId: "G-Z20BRYG0J2"
  });


const messaging = firebase.messaging();
 
*/
var staticCacheName = "pwa";

self.addEventListener("install", function (e) {
e.waitUntil(
	caches.open(staticCacheName).then(function (cache) {
	return cache.addAll(["/"]);
	})
);
});

self.addEventListener("fetch", function (event) {
console.log(event.request.url);

event.respondWith(
	caches.match(event.request).then(function (response) {
	return response || fetch(event.request);
	})
);
});


 
self.addEventListener('notificationclick', (event) => {
    
    
    /*
    if (!event.action) {
        // Was a normal notification click
        console.log('Notification Click.');
        return;
    }

    const clickedNotification = event.notification;
    console.log(clickedNotification);
    
    clickedNotification.close();
  
    // Do something as the result of the notification click
    const promiseChain = clients.openWindow('https://www.google.com');
    event.waitUntil(promiseChain);*/
    const rootUrl = new URL('./', location).href; 
    event.notification.close();
    event.waitUntil(
        clients.matchAll().then(matchedClients =>
        {
            for (let client of matchedClients)
            {
                if (client.url.indexOf(rootUrl) >= 0)
                {
                    client.focus();
                    client.postMessage(event.notification.data);
                    return;
                }
            }

            return clients.openWindow(rootUrl).then(function (client) { client.focus(); });
        })
    );
  });

self.addEventListener('push', async function(event) {

    const data = event.data.json();
    console.log(data);
    event.waitUntil(
        
        self.registration.showNotification(data.notification.title, 
        {
          body: data.notification.body,
          icon:data.notification.icon,
          image:data.notification.image,
          badge:'images/badge.png',
          actions: data.notification.actions,

        }
        )
    );
});
