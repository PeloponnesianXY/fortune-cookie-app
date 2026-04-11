import AsyncStorage from '@react-native-async-storage/async-storage';

import { MOOD_BUCKET_KEYS, moderateCustomFortuneText } from './fortuneLogic';

const CUSTOM_FORTUNES_STORAGE_KEY = '@fortune-cookie-daily/custom-fortunes';
const MIN_FORTUNE_LENGTH = 12;
const MAX_FORTUNE_LENGTH = 140;

function createEmptyCustomFortunes() {
  return MOOD_BUCKET_KEYS.reduce((accumulator, key) => {
    accumulator[key] = [];
    return accumulator;
  }, {});
}

function normalizeStoredCustomFortunes(value) {
  const base = createEmptyCustomFortunes();

  if (!value || typeof value !== 'object') {
    return base;
  }

  if (Array.isArray(value.averse)) {
    base.disgusted = value.averse
      .filter((item) => typeof item === 'string' && item.trim())
      .map((item) => item.trim());
  }

  if (Array.isArray(value.loving)) {
    base.caring = value.loving
      .filter((item) => typeof item === 'string' && item.trim())
      .map((item) => item.trim());
  }

  if (Array.isArray(value.affectionate)) {
    base.caring = [
      ...base.caring,
      ...value.affectionate
      .filter((item) => typeof item === 'string' && item.trim())
      .map((item) => item.trim()),
    ];
  }

  if (Array.isArray(value.romantic)) {
    base.romantic = value.romantic
      .filter((item) => typeof item === 'string' && item.trim())
      .map((item) => item.trim());
  }

  if (Array.isArray(value.amazed)) {
    base.wowed = value.amazed
      .filter((item) => typeof item === 'string' && item.trim())
      .map((item) => item.trim());
  }

  if (Array.isArray(value.delighted)) {
    base.wowed = [
      ...base.wowed,
      ...value.delighted
        .filter((item) => typeof item === 'string' && item.trim())
        .map((item) => item.trim()),
    ];
  }

  if (Array.isArray(value.surprised)) {
    base.shaken = value.surprised
      .filter((item) => typeof item === 'string' && item.trim())
      .map((item) => item.trim());
  }

  if (Array.isArray(value.blindsided)) {
    base.shaken = [
      ...base.shaken,
      ...value.blindsided
        .filter((item) => typeof item === 'string' && item.trim())
        .map((item) => item.trim()),
    ];
  }

  if (Array.isArray(value.awkward)) {
    base.embarrassed = value.awkward
      .filter((item) => typeof item === 'string' && item.trim())
      .map((item) => item.trim());
  }

  for (const key of MOOD_BUCKET_KEYS) {
    const normalizedItems = Array.isArray(value[key])
      ? value[key].filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim())
      : [];

    base[key] = key === 'disgusted' || key === 'caring' || key === 'romantic'
      ? [...new Set([...base[key], ...normalizedItems])]
      : normalizedItems;
  }

  return base;
}

function normalizeForDuplicateCheck(value) {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function formatMoodBucketLabel(moodKey) {
  if (moodKey === 'averse' || moodKey === 'disgusted') {
    return 'Disgusted';
  }

  if (moodKey === 'caring') {
    return 'Affectionate';
  }

  if (moodKey === 'emotional') {
    return 'Emotional';
  }

  if (moodKey === 'engaged') {
    return 'Engaged';
  }

  if (moodKey === 'romantic') {
    return 'Romantic';
  }

  if (moodKey === 'embarrassed') {
    return 'Embarrassed';
  }

  if (moodKey === 'shaken') {
    return 'Shaken';
  }

  if (moodKey === 'wowed') {
    return 'Wowed';
  }

  if (moodKey === 'guilty') {
    return 'Remorseful';
  }

  if (moodKey === 'distracted') {
    return 'Unbalanced';
  }

  return moodKey.charAt(0).toUpperCase() + moodKey.slice(1);
}

export async function loadCustomFortunes() {
  const raw = await AsyncStorage.getItem(CUSTOM_FORTUNES_STORAGE_KEY);

  if (!raw) {
    return createEmptyCustomFortunes();
  }

  try {
    return normalizeStoredCustomFortunes(JSON.parse(raw));
  } catch {
    return createEmptyCustomFortunes();
  }
}

export async function getCustomFortunesForMood(moodKey) {
  const fortunes = await loadCustomFortunes();
  return fortunes[moodKey] || [];
}

export async function saveCustomFortunes(nextValue) {
  const normalized = normalizeStoredCustomFortunes(nextValue);
  await AsyncStorage.setItem(CUSTOM_FORTUNES_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

async function validateCustomFortuneForSave({
  moodKey,
  fortuneText,
  ignoreDuplicateMatch,
}) {
  if (!moodKey || !MOOD_BUCKET_KEYS.includes(moodKey)) {
    return { ok: false, error: 'Choose a mood first.' };
  }

  const trimmed = fortuneText.trim();

  if (!trimmed) {
    return { ok: false, error: 'Write a fortune before saving.' };
  }

  if (trimmed.length < MIN_FORTUNE_LENGTH) {
    return { ok: false, error: 'Fortunes must be at least 12 characters.' };
  }

  if (trimmed.length > MAX_FORTUNE_LENGTH) {
    return { ok: false, error: 'Fortunes must be 140 characters or fewer.' };
  }

  const moderation = moderateCustomFortuneText(trimmed);
  if (moderation.moderation !== 'clean') {
    return {
      ok: false,
      moderation: moderation.moderation,
      error: moderation.moderation === 'blocked-danger'
        ? 'This fortune cannot be saved.'
        : 'This fortune cannot be saved because it contains hate or unsafe language.',
    };
  }

  const existing = await getCustomFortunesForMood(moodKey);
  const normalizedCandidate = normalizeForDuplicateCheck(trimmed);
  const hasDuplicate = existing.some((item) => {
    if (ignoreDuplicateMatch?.(item)) {
      return false;
    }

    return normalizeForDuplicateCheck(item) === normalizedCandidate;
  });

  if (hasDuplicate) {
    return { ok: false, error: `That fortune is already saved for ${formatMoodBucketLabel(moodKey)}.` };
  }

  return {
    ok: true,
    trimmedFortune: trimmed,
  };
}

export async function validateCustomFortune({ moodKey, fortuneText }) {
  return validateCustomFortuneForSave({ moodKey, fortuneText });
}

export async function saveCustomFortune({ moodKey, fortuneText }) {
  const validation = await validateCustomFortuneForSave({ moodKey, fortuneText });
  if (!validation.ok) {
    return validation;
  }

  const fortunes = await loadCustomFortunes();
  const nextFortunes = {
    ...fortunes,
    [moodKey]: [...(fortunes[moodKey] || []), validation.trimmedFortune],
  };

  await saveCustomFortunes(nextFortunes);

  return {
    ok: true,
    fortunes: nextFortunes,
    savedFortune: validation.trimmedFortune,
  };
}

export async function updateCustomFortune({
  previousMoodKey,
  previousFortuneText,
  nextMoodKey,
  nextFortuneText,
}) {
  const normalizedPrevious = normalizeForDuplicateCheck(previousFortuneText);
  const validation = await validateCustomFortuneForSave({
    moodKey: nextMoodKey,
    fortuneText: nextFortuneText,
    ignoreDuplicateMatch: (item) => (
      previousMoodKey === nextMoodKey
      && normalizeForDuplicateCheck(item) === normalizedPrevious
    ),
  });

  if (!validation.ok) {
    return validation;
  }

  const fortunes = await loadCustomFortunes();
  const nextFortunes = {
    ...fortunes,
    [previousMoodKey]: (fortunes[previousMoodKey] || []).filter(
      (item) => normalizeForDuplicateCheck(item) !== normalizedPrevious
    ),
    [nextMoodKey]: [
      ...(previousMoodKey === nextMoodKey
        ? (fortunes[nextMoodKey] || []).filter(
            (item) => normalizeForDuplicateCheck(item) !== normalizedPrevious
          )
        : fortunes[nextMoodKey] || []),
      validation.trimmedFortune,
    ],
  };

  await saveCustomFortunes(nextFortunes);

  return {
    ok: true,
    fortunes: nextFortunes,
    savedFortune: validation.trimmedFortune,
  };
}

export async function deleteCustomFortune({ moodKey, fortuneText }) {
  const normalizedTarget = normalizeForDuplicateCheck(fortuneText);
  const fortunes = await loadCustomFortunes();
  const nextFortunes = {
    ...fortunes,
    [moodKey]: (fortunes[moodKey] || []).filter(
      (item) => normalizeForDuplicateCheck(item) !== normalizedTarget
    ),
  };

  await saveCustomFortunes(nextFortunes);

  return {
    ok: true,
    fortunes: nextFortunes,
  };
}

export async function clearAllCustomFortunes() {
  const nextFortunes = createEmptyCustomFortunes();
  await saveCustomFortunes(nextFortunes);

  return {
    ok: true,
    fortunes: nextFortunes,
  };
}

export function buildCreatedFortuneSections(fortunesByMood) {
  return MOOD_BUCKET_KEYS
    .map((moodKey) => {
      const items = fortunesByMood[moodKey] || [];
      if (items.length === 0) {
        return null;
      }

      return {
        key: moodKey,
        label: formatMoodBucketLabel(moodKey),
        items: items.map((item) => ({
          id: `${moodKey}:${normalizeForDuplicateCheck(item)}`,
          moodKey,
          text: item,
        })),
      };
    })
    .filter(Boolean);
}

export {
  CUSTOM_FORTUNES_STORAGE_KEY,
  MAX_FORTUNE_LENGTH,
  MIN_FORTUNE_LENGTH,
};
