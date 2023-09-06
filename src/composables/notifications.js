import { PushNotifications } from '@capacitor/push-notifications';
import {Capacitor} from '@capacitor/core';
import { useFetch } from '../composables/fetch'

const addListeners = async () => {
  await PushNotifications.addListener('registration', async token => {
    console.log('Registration token: ', token.value);
    const reg = await useFetch({ route: '/pushNotifications/registerFirebaseToken', body: { token: token.value } })
    console.log('retorno firebase token', reg)
    window.localStorage.setItem('fbToken', token.value)
  });

  await PushNotifications.addListener('registrationError', err => {
    console.log('Registration error: ', err.error);
  });

  await PushNotifications.addListener('pushNotificationReceived', notification => {
    console.log('Push notification received: ', notification);
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
    console.log('Push notification action performed', notification.actionId, notification.inputValue);
  });
}

const registerNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!');
  }

  await PushNotifications.register();
}

// const getDeliveredNotifications = async () => {
//   const notificationList = await PushNotifications.getDeliveredNotifications();
//   console.log('delivered notifications', notificationList);
// }

const initPush = async () => {
  if (Capacitor.getPlatform() !== 'web') {
    registerPush()
  }
}

const registerPush = async () => {
  await registerNotifications()
  await addListeners()
}

export default { initPush }