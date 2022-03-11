import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

export const getNotificationToken = async () => {
  try {
    let token;
    if (!Constants.isDevice) {
      return null;
    }
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } catch (err) {
    alert("Failed to get token");
    alert(err);
    return null;
  }
};

export const triggerNotification = async (title, body, seconds) => {
  const notification_id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { data: "" },
    },
    trigger: {
      seconds,
    },
  });

  return notification_id;
};

export const sendNotification = async (expoPushToken, title, body) => {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: { someData: "" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};

export const removeScheduledNotification = async (notification_id) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notification_id);
    return true;
  } catch (err) {
    return false;
  }
};
