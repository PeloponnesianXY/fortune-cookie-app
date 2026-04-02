import AsyncStorage from '@react-native-async-storage/async-storage';

import { getLocalDayKey } from './dateUtils';

const STREAK_STORAGE_KEY = '@fortune-cookie-daily/streak';

function parseStoredStreak(rawValue) {
  if (!rawValue) {
    return {
      count: 0,
      lastEligibleDayKey: null,
    };
  }

  try {
    const parsed = JSON.parse(rawValue);
    return {
      count: Number.isFinite(parsed?.count) ? Math.max(0, parsed.count) : 0,
      lastEligibleDayKey: parsed?.lastEligibleDayKey || null,
    };
  } catch {
    return {
      count: 0,
      lastEligibleDayKey: null,
    };
  }
}

function toLocalDate(dayKey) {
  if (!dayKey) {
    return null;
  }

  const [year, month, day] = dayKey.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function getDayDifference(previousDayKey, nextDayKey) {
  const previousDate = toLocalDate(previousDayKey);
  const nextDate = toLocalDate(nextDayKey);

  if (!previousDate || !nextDate) {
    return null;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((nextDate.getTime() - previousDate.getTime()) / millisecondsPerDay);
}

async function writeStreak(snapshot) {
  await AsyncStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(snapshot));
  return snapshot;
}

export async function getStoredStreak() {
  const rawValue = await AsyncStorage.getItem(STREAK_STORAGE_KEY);
  return parseStoredStreak(rawValue);
}

export async function registerDailyStreak(dayKey = getLocalDayKey()) {
  const current = await getStoredStreak();

  if (current.lastEligibleDayKey === dayKey) {
    return {
      ...current,
      didAdvance: false,
    };
  }

  const dayDifference = getDayDifference(current.lastEligibleDayKey, dayKey);
  const nextCount = !current.lastEligibleDayKey
    ? 1
    : dayDifference === 1
      ? current.count + 1
      : 1;

  const nextSnapshot = {
    count: nextCount,
    lastEligibleDayKey: dayKey,
  };

  await writeStreak(nextSnapshot);

  return {
    ...nextSnapshot,
    didAdvance: true,
  };
}

export { STREAK_STORAGE_KEY };
