import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const BADGE_NOTIFICATION_ID_STORAGE_KEY = '@fortune-cookie-daily/badge-notification-id';

let attemptedPermissionRequest = false;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: false,
    shouldShowList: false,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

function supportsBadge() {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

async function hasBadgePermissionAsync() {
  const permissions = await Notifications.getPermissionsAsync();
  return permissions.granted || permissions.ios?.allowsBadge === true;
}

async function ensureBadgePermissionAsync() {
  if (!supportsBadge()) {
    return false;
  }

  if (await hasBadgePermissionAsync()) {
    return true;
  }

  if (attemptedPermissionRequest) {
    return false;
  }

  attemptedPermissionRequest = true;

  const nextPermissions = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: false,
      allowBadge: true,
      allowSound: false,
    },
  });

  return nextPermissions.granted || nextPermissions.ios?.allowsBadge === true;
}

async function ensureDailyBadgeScheduleAsync() {
  const hasPermission = await ensureBadgePermissionAsync();
  if (!hasPermission) {
    return false;
  }

  const existingId = await AsyncStorage.getItem(BADGE_NOTIFICATION_ID_STORAGE_KEY);
  if (existingId) {
    return true;
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      badge: 1,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 0,
      minute: 0,
    },
  });

  await AsyncStorage.setItem(BADGE_NOTIFICATION_ID_STORAGE_KEY, notificationId);
  return true;
}

export async function syncAppBadgeAsync(hasOpenedToday) {
  const ready = await ensureDailyBadgeScheduleAsync();
  if (!ready) {
    return false;
  }

  return Notifications.setBadgeCountAsync(hasOpenedToday ? 0 : 1);
}
