import * as Notifications from "expo-notifications";

import { Platform } from "react-native";
import Constants from "expo-constants";
import { Base_URL_CUSTOM } from "../api/constants";

async function requestNotificationPermissions() {
  if (Platform.OS === "ios") {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.status !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      return status;
    }
    return settings.status;
  } else {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.status !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      return status;
    }
    return settings.status;
  }
}

export default async function registerForPushNotificationsAsync(
  currentUserID: any,
  currentUser: any,
  isPublicToken: any
) {
  Notifications.setNotificationHandler({
    handleNotification: async () => {
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    },
  });

  const status = await requestNotificationPermissions();
  if (status === "granted") {
    let token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.["eas"].projectId,
    });

    if (token) {
      if (!isPublicToken) {
        fetch(`${Base_URL_CUSTOM}store-notification-token`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            user_id: currentUserID,
            notification_token: token.data,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            // Handle response if needed
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        fetch(`${Base_URL_CUSTOM}store-public-notification-token`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            notification_token: token.data,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {})
          .catch((error) => {
            console.log(error);
          });
      }
    }
  } else {
    // Handle case where permission is not granted
    console.log("Notification permission not granted");
  }
}
