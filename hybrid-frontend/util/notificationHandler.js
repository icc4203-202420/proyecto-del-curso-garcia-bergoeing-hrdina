// util/notificationHandler.js
import { Linking } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function setupNotificationHandler() {
  return {
    config: {
      // Your custom deep linking configuration can go here
    },
    async getInitialURL() {
      // First, check if the app was opened from a deep link
      const url = await Linking.getInitialURL();
      if (url != null) {
        return url;
      }

      // Check if the app was opened from a push notification
      const response = await Notifications.getLastNotificationResponseAsync();
      return response?.notification.request.content.data.url;
    },
    subscribe(listener) {
      // Listener for deep linking
      const onReceiveURL = ({ url }) => listener(url);
      const eventListenerSubscription = Linking.addEventListener('url', onReceiveURL);

      // Listener for push notifications
      const notificationSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        const url = response.notification.request.content.data.url;
        listener(url);
      });

      // Return a function to clean up event listeners
      return () => {
        eventListenerSubscription.remove();
        notificationSubscription.remove();
      };
    },
  };
}
