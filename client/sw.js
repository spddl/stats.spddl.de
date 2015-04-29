'use strict';
console.log('here');
self.addEventListener('notify', function(event) {
    console.log('On notification click: ', event);

    var title = 'adasd';
    var message = 'asdasd';
    var notificationTag = 'asdasd';

    return self.registration.showNotification(title, {
        body: message,
        tag: notificationTag
    });
});