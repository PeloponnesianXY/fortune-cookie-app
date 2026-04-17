async function main() {
  const { MOOD_BUCKET_KEYS } = await import('../data/vocabulary/moodVocabularyRuntimeWrapper.js');
  const { MOOD_SCENE_KEYS, SCENE_LIBRARY } = await import('../data/scenes/scenes.js');

  const errors = [];
  const sceneKeys = new Set(Object.keys(SCENE_LIBRARY));
  const assignedBuckets = Object.keys(MOOD_SCENE_KEYS);

  for (const bucket of MOOD_BUCKET_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(MOOD_SCENE_KEYS, bucket)) {
      errors.push(`Missing scene mapping for "${bucket}".`);
      continue;
    }

    const sceneKey = MOOD_SCENE_KEYS[bucket];
    if (!sceneKeys.has(sceneKey)) {
      errors.push(`Bucket "${bucket}" points to unknown scene "${sceneKey}".`);
    }
  }

  for (const bucket of assignedBuckets) {
    if (!MOOD_BUCKET_KEYS.includes(bucket)) {
      errors.push(`Scene mapping contains unknown bucket "${bucket}".`);
    }
  }

  if (MOOD_SCENE_KEYS.neutral !== 'fogDrift') {
    errors.push(`Expected neutral -> fogDrift, received "${MOOD_SCENE_KEYS.neutral}".`);
  }

  if (MOOD_SCENE_KEYS.unknown !== 'plainLight') {
    errors.push(`Expected unknown -> plainLight, received "${MOOD_SCENE_KEYS.unknown}".`);
  }

  if (MOOD_SCENE_KEYS.confused !== 'fogDrift') {
    errors.push(`Expected confused -> fogDrift, received "${MOOD_SCENE_KEYS.confused}".`);
  }

  if (MOOD_SCENE_KEYS.calm !== 'firstLight') {
    errors.push(`Expected calm -> firstLight, received "${MOOD_SCENE_KEYS.calm}".`);
  }

  if (MOOD_SCENE_KEYS.engaged !== 'firstLight') {
    errors.push(`Expected engaged -> firstLight, received "${MOOD_SCENE_KEYS.engaged}".`);
  }

  if (MOOD_SCENE_KEYS.wowed !== 'firstLight') {
    errors.push(`Expected wowed -> firstLight, received "${MOOD_SCENE_KEYS.wowed}".`);
  }

  const plainLightBuckets = assignedBuckets.filter((bucket) => MOOD_SCENE_KEYS[bucket] === 'plainLight');
  if (plainLightBuckets.length !== 1 || plainLightBuckets[0] !== 'unknown') {
    errors.push(`plainLight should be used only by unknown. Found: ${plainLightBuckets.join(', ') || '(none)'}.`);
  }

  const fogDriftBuckets = assignedBuckets.filter((bucket) => MOOD_SCENE_KEYS[bucket] === 'fogDrift');
  const expectedFogDriftBuckets = ['confused', 'neutral'];
  if (
    fogDriftBuckets.length !== expectedFogDriftBuckets.length
    || expectedFogDriftBuckets.some((bucket) => !fogDriftBuckets.includes(bucket))
  ) {
    errors.push(`fogDrift should be used only by confused and neutral. Found: ${fogDriftBuckets.join(', ') || '(none)'}.`);
  }

  const firstLightBuckets = assignedBuckets.filter((bucket) => MOOD_SCENE_KEYS[bucket] === 'firstLight');
  const expectedFirstLightBuckets = ['calm', 'engaged', 'wowed'];
  if (
    firstLightBuckets.length !== expectedFirstLightBuckets.length
    || expectedFirstLightBuckets.some((bucket) => !firstLightBuckets.includes(bucket))
  ) {
    errors.push(`firstLight should be used only by calm, engaged, wowed. Found: ${firstLightBuckets.join(', ') || '(none)'}.`);
  }

  const sunlitAirBuckets = assignedBuckets.filter((bucket) => MOOD_SCENE_KEYS[bucket] === 'sunlitAir');
  if (sunlitAirBuckets.length !== 0) {
    errors.push(`sunlitAir should be landing-only and unused by moods. Found: ${sunlitAirBuckets.join(', ') || '(none)'}.`);
  }

  if (errors.length > 0) {
    console.error('Scene mapping validation failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Scene mapping validated for ${MOOD_BUCKET_KEYS.length} moods across ${sceneKeys.size} scenes.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
