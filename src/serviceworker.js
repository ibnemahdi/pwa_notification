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
    const rootUrl = new URL('./', location).href; 
    event.notification.close();
    const click_event_msg = {   
        actions:event.notification.actions, 
        data:event.notification.data,
        icon:'/favicon.ico',
        badge:'images/badge.png',
        title:event.notification.title,
        body:event.notification.body,
        clicked_action:event.action,
        image:event.notification.image
    };
    console.log(event);
    const rootUrlWithParameters = `${rootUrl}?msg_payload=${JSON.stringify(click_event_msg)}`;

    event.waitUntil(
        clients.matchAll().then(matchedClients =>
        {
            for (let client of matchedClients)
            {
                if (client.url.indexOf(rootUrl) >= 0)
                {
                    client.focus();
                    client.postMessage(click_event_msg);
                    return;
                }
            }
            return clients.openWindow(rootUrlWithParameters).then(function (client) { 
                            //client.focus() 
                        
                        });
        })
    );
  });


self.addEventListener('push', (e) => {
    const data = e.data.json();
    e.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        const client = clientList.find(c => c.visibilityState === 'visible') // <- This validation
        if (e.data && client) {
        console.log('app is in foreground')
        const click_event_msg = {   
            body: data.notification.body,
            icon:'/favicon.ico',
            image:data.notification.image,
            badge:'images/badge.png',
            actions: data.notification.actions,
            title:data.notification.title,
            data:data.data,
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
                icon:'/favicon.ico',
                image:data.notification.image,
                badge:'images/badge.png',
                actions: data.notification.actions,
                title:data.notification.title,
                data:data.data,
            })
        );
        }
      })
    )
  })
