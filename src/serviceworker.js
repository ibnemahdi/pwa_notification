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
    const click_event_msg = {   
        actions:event.notification.actions, 
        data:event.notification.data,
        icon:event.notification.icon,
        badge:event.notification.badge,
        title:event.notification.title,
        clicked_action:event.action
    };
    const rootUrlWithParameters = `${rootUrl}?msg=${JSON.stringify(click_event_msg)}`;

    event.waitUntil(
        clients.matchAll().then(matchedClients =>
        {
            for (let client of matchedClients)
            {
                if (client.url.indexOf(rootUrl) >= 0)
                {
                    client.focus();
                   
                    console.log("Service Worker data:",click_event_msg )
                    client.postMessage(click_event_msg);
                    return;
                }
            }

            return clients.openWindow(rootUrlWithParameters).then(function (client) { 
                            //client.focus() 
                            //client.postMessage("hello World");
                        
                        });
        })
    );
  });




/*
  self.addEventListener('push', async function(event) {

    const data = event.data.json();

    event.waitUntil(
        self.registration.showNotification(data.notification.title, 
        {
            body: data.notification.body,
            icon:data.notification.icon,
            image:data.notification.image,
            badge:'images/badge.png',
            actions: data.notification.actions,
        })
    );

    // Check if any clients are currently open and in the foreground
    const clientsList = await self.clients.matchAll({ type: 'window' });
    const client = clientsList.find(c => c.visibilityState === 'visible');
    if (client) {
        // Application is in the foreground, do something
        console.log('Application is in the foreground');
    } else {
        // Application is in the background, do something else
        console.log('Application is in the background');
    }
});

*/
self.addEventListener('push', (e) => {
    const data = e.data.json();
    e.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        const client = clientList.find(c => c.visibilityState === 'visible') // <- This validation
        if (e.data && client) {
        console.log('app is in foreground')
        const click_event_msg = {   
            body: data.notification.body,
            icon:data.notification.icon,
            image:data.notification.image,
            badge:'images/badge.png',
            actions: data.notification.actions,
            title:data.notification.title
        };
        console.log("Service Worker data:",click_event_msg )
        client.postMessage(click_event_msg);
        
        }else{
          
          console.log('app in background')
          //const envelope = e.data.json()
          //e.waitUntil(self.registration.showNotification(data.subject, options))
          e.waitUntil(
            self.registration.showNotification(data.notification.title, 
            {
                body: data.notification.body,
                icon:data.notification.icon,
                image:data.notification.image,
                badge:'images/badge.png',
                actions: data.notification.actions,
                title:data.notification.title
            })
        );
        }
      })
    )
  })
