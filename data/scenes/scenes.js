/* Shared runtime scene definitions and mood-to-scene mapping.
   Keep this file as the single source of truth for scene names and palette tuning. */

const BASE_SCENE = {
  textPrimary: '#4d473f',
  accent: '#9f9385',
  accentSoft: '#d4ccc2',
  panel: 'rgba(250, 248, 244, 0.96)',
  panelBorder: 'rgba(124, 114, 102, 0.14)',
  input: 'rgba(255, 255, 252, 0.98)',
  inputBorder: 'rgba(150, 139, 126, 0.18)',
  statusBar: 'dark',
  stars: [],
};

function hexToRgba(hex, alpha) {
  const normalized = hex.replace('#', '');
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function createAtmosphericScene({
  sky,
  wash,
  glow,
  accent,
  textDark,
}) {
  return {
    ...BASE_SCENE,
    sky,
    wash: hexToRgba(wash, 0.82),
    celestial: glow,
    celestialHalo: hexToRgba(glow, 0.28),
    cloud: hexToRgba(accent, 0.12),
    textPrimary: textDark,
    accent,
    accentSoft: hexToRgba(accent, 0.5),
    panel: hexToRgba(glow, 0.88),
    panelBorder: hexToRgba(textDark, 0.11),
    input: hexToRgba('#FFFFFF', 0.95),
    inputBorder: hexToRgba(accent, 0.16),
  };
}

const SCENE_LIBRARY = {
  goldenQuiet: createAtmosphericScene({
    sky: '#F3DECA',
    wash: '#FBEEE0',
    glow: '#F8D8B1',
    accent: '#C4906D',
    textDark: '#5B4334',
  }),
  firstLight: createAtmosphericScene({
    sky: '#F6E5C9',
    wash: '#FCF1DD',
    glow: '#F6E0A6',
    accent: '#C7A56E',
    textDark: '#5D4A36',
  }),
  sunlitAir: createAtmosphericScene({
    sky: '#F6E6D2',
    wash: '#FCF2E4',
    glow: '#F6DEB1',
    accent: '#C9A06F',
    textDark: '#5B4937',
  }),
  roseBlush: createAtmosphericScene({
    sky: '#F0D8D7',
    wash: '#F8E9E8',
    glow: '#F3C9B1',
    accent: '#C58E8D',
    textDark: '#5D4342',
  }),
  emberField: createAtmosphericScene({
    sky: '#E1B8B1',
    wash: '#F0D1CB',
    glow: '#F7DDD5',
    accent: '#BA6054',
    textDark: '#5E3F3A',
  }),
  heatHaze: createAtmosphericScene({
    sky: '#D6BBB4',
    wash: '#E8D3CD',
    glow: '#EEDCD6',
    accent: '#B26E63',
    textDark: '#583C37',
  }),
  softStatic: createAtmosphericScene({
    sky: '#D8D3DB',
    wash: '#E8E3EB',
    glow: '#F3EFF5',
    accent: '#A79CAF',
    textDark: '#5C5564',
  }),
  plainLight: createAtmosphericScene({
    sky: '#DDD8D6',
    wash: '#ECE7E4',
    glow: '#F6F2EE',
    accent: '#AAA1A3',
    textDark: '#575254',
  }),
  fogDrift: createAtmosphericScene({
    sky: '#D7D7DE',
    wash: '#E8E6EA',
    glow: '#F4F2F4',
    accent: '#AFA5B1',
    textDark: '#605B63',
  }),
};

const MOOD_SCENE_KEYS = {
  // Warm, tender, and clearly positive.
  caring: 'goldenQuiet',
  confident: 'goldenQuiet',
  grateful: 'goldenQuiet',
  proud: 'goldenQuiet',
  happy: 'roseBlush',

  // Open, airy positive energy.
  calm: 'firstLight',
  engaged: 'firstLight',
  wowed: 'firstLight',

  // Rosier uplift, affection, and self-belief.
  emotional: 'roseBlush',
  hopeful: 'roseBlush',
  romantic: 'roseBlush',

  // Heated defensive states.
  angry: 'emberField',
  disgusted: 'emberField',
  frustrated: 'emberField',
  jealous: 'emberField',

  // Quiet heavy and depleted.
  guilty: 'softStatic',
  lonely: 'softStatic',
  numb: 'softStatic',
  sad: 'softStatic',
  sick: 'softStatic',
  tired: 'softStatic',

  // Activated, frazzled, and socially exposed.
  anxious: 'heatHaze',
  distracted: 'heatHaze',
  embarrassed: 'heatHaze',
  hungry: 'heatHaze',
  shaken: 'heatHaze',
  stressed: 'heatHaze',
  wired: 'heatHaze',

  // Intentionally isolated singletons. Do not merge these with adjacent moods.
  neutral: 'fogDrift',
  unknown: 'plainLight',
  confused: 'fogDrift',
};

export { SCENE_LIBRARY, MOOD_SCENE_KEYS };
