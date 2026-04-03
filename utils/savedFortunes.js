import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_STORAGE_KEY = '@fortune-cookie-daily/history';
const FAVORITES_STORAGE_KEY = '@fortune-cookie-daily/favorites';
const MAX_HISTORY_ITEMS = 30;
const MAX_RECENT_HISTORY_ITEMS = 10;

function parseStoredList(rawValue) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeSavedFortune(item) {
  if (!item?.id || !item?.text || !item?.createdAt) {
    return null;
  }

  return {
    id: item.id,
    text: item.text,
    mood: item.mood || null,
    category: item.category || null,
    createdAt: item.createdAt,
    isFavorite: Boolean(item.isFavorite),
    favoritedAt: item.favoritedAt || null,
  };
}

function sortNewestFirst(items) {
  return [...items].sort((left, right) => (
    new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  ));
}

function sortFavoritesNewestFirst(items) {
  return [...items].sort((left, right) => {
    const leftTimestamp = new Date(left.favoritedAt || left.createdAt).getTime();
    const rightTimestamp = new Date(right.favoritedAt || right.createdAt).getTime();
    return rightTimestamp - leftTimestamp;
  });
}

function findById(items, id) {
  return items.find((item) => item.id === id) || null;
}

async function writeList(key, items) {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

export function createSavedFortuneRecord(selection, moodInput = '') {
  return {
    id: selection.id,
    text: selection.fortuneText,
    mood: moodInput?.trim() || null,
    category: selection.analysis?.primaryEmotion || null,
    createdAt: selection.createdAt,
    isFavorite: false,
    favoritedAt: null,
  };
}

export async function getSavedFortunesSnapshot() {
  const [historyRaw, favoritesRaw] = await AsyncStorage.multiGet([
    HISTORY_STORAGE_KEY,
    FAVORITES_STORAGE_KEY,
  ]);

  const history = sortNewestFirst(
    parseStoredList(historyRaw?.[1]).map(normalizeSavedFortune).filter(Boolean)
  );
  const favorites = sortFavoritesNewestFirst(
    parseStoredList(favoritesRaw?.[1]).map(normalizeSavedFortune).filter(Boolean)
  );

  return {
    history,
    favorites,
  };
}

export async function saveFortuneToHistory(record) {
  const { history, favorites } = await getSavedFortunesSnapshot();
  const existingFavorite = findById(favorites, record.id);
  const nextRecord = {
    ...record,
    isFavorite: Boolean(existingFavorite),
    favoritedAt: existingFavorite?.favoritedAt || null,
  };

  const nextHistory = [
    nextRecord,
    ...history.filter((item) => item.id !== record.id),
  ].slice(0, MAX_HISTORY_ITEMS);

  await writeList(HISTORY_STORAGE_KEY, nextHistory);

  return {
    history: nextHistory,
    favorites,
  };
}

export async function saveFortuneToFavorites(record) {
  const { history, favorites } = await getSavedFortunesSnapshot();
  const existingFavorite = findById(favorites, record.id);
  const favoriteTimestamp = existingFavorite?.favoritedAt || new Date().toISOString();
  const nextFavorite = {
    ...record,
    isFavorite: true,
    favoritedAt: favoriteTimestamp,
  };

  const nextFavorites = sortFavoritesNewestFirst([
    nextFavorite,
    ...favorites.filter((item) => item.id !== record.id),
  ]);

  const historyRecord = findById(history, record.id);
  const nextHistory = historyRecord
    ? sortNewestFirst([
        {
          ...historyRecord,
          isFavorite: true,
          favoritedAt: favoriteTimestamp,
        },
        ...history.filter((item) => item.id !== record.id),
      ]).slice(0, MAX_HISTORY_ITEMS)
    : history;

  await AsyncStorage.multiSet([
    [HISTORY_STORAGE_KEY, JSON.stringify(nextHistory)],
    [FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites)],
  ]);

  return {
    history: nextHistory,
    favorites: nextFavorites,
    isFavorite: true,
  };
}

export async function toggleFavoriteFortune(record) {
  const { history, favorites } = await getSavedFortunesSnapshot();
  const existingFavorite = findById(favorites, record.id);
  const nextIsFavorite = !existingFavorite;
  const favoriteTimestamp = existingFavorite?.favoritedAt || new Date().toISOString();

  const nextFavorites = nextIsFavorite
    ? sortFavoritesNewestFirst([
        {
          ...record,
          isFavorite: true,
          favoritedAt: favoriteTimestamp,
        },
        ...favorites.filter((item) => item.id !== record.id),
      ])
    : favorites.filter((item) => item.id !== record.id);

  const historyRecord = findById(history, record.id);
  const nextHistory = sortNewestFirst([
    {
      ...(historyRecord || record),
      isFavorite: nextIsFavorite,
      favoritedAt: nextIsFavorite ? favoriteTimestamp : null,
    },
    ...history.filter((item) => item.id !== record.id),
  ]).slice(0, MAX_HISTORY_ITEMS);

  await AsyncStorage.multiSet([
    [HISTORY_STORAGE_KEY, JSON.stringify(nextHistory)],
    [FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites)],
  ]);

  return {
    history: nextHistory,
    favorites: nextFavorites,
    isFavorite: nextIsFavorite,
  };
}

export function collapseFortuneRuns(items, limit = MAX_RECENT_HISTORY_ITEMS) {
  const collapsed = [];

  for (const item of items) {
    const previous = collapsed[collapsed.length - 1];

    if (previous && previous.text === item.text && previous.mood === item.mood) {
      previous.repeatCount += 1;
      previous.latestCreatedAt = previous.latestCreatedAt || previous.createdAt;
      continue;
    }

    collapsed.push({
      ...item,
      latestCreatedAt: item.createdAt,
      repeatCount: 1,
    });

    if (collapsed.length >= limit) {
      break;
    }
  }

  return collapsed;
}
