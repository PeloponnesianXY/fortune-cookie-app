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
    sky: '#F7E6CE',
    wash: '#FFF4DB',
    glow: '#F8BF67',
    accent: '#B78D63',
    textDark: '#5B4634',
  }),
  firstLight: createAtmosphericScene({
    sky: '#F3E7D6',
    wash: '#FAF1E5',
    glow: '#F6D79B',
    accent: '#BFAE9A',
    textDark: '#625548',
  }),
  emberField: createAtmosphericScene({
    sky: '#D6C6BF',
    wash: '#E8DCD7',
    glow: '#F6F1ED',
    accent: '#B28F87',
    textDark: '#65534D',
  }),
  blueHush: createAtmosphericScene({
    sky: '#C7CFD8',
    wash: '#DDE3EB',
    glow: '#F3F6F9',
    accent: '#A7B1BE',
    textDark: '#53606E',
  }),
  softStatic: createAtmosphericScene({
    sky: '#D0CFD7',
    wash: '#E4E2E8',
    glow: '#F5F4F7',
    accent: '#ADA8B5',
    textDark: '#5C5964',
  }),
  plainLight: createAtmosphericScene({
    sky: '#D8D6D1',
    wash: '#E9E7E2',
    glow: '#F5F4F1',
    accent: '#AAA7A0',
    textDark: '#59574F',
  }),
  unknownSky: createAtmosphericScene({
    sky: '#AAB0BA',
    wash: '#C7CCD3',
    glow: '#E7EAEF',
    accent: '#8C93A0',
    textDark: '#535A67',
  }),
  fogDrift: createAtmosphericScene({
    sky: '#CFD1D8',
    wash: '#E5E3E8',
    glow: '#F4F3F6',
    accent: '#B3AEB8',
    textDark: '#615F68',
  }),
};

const MOOD_SCENE_KEYS = {
  // Warm, tender, and clearly positive.
  caring: 'goldenQuiet',
  emotional: 'goldenQuiet',
  grateful: 'goldenQuiet',
  happy: 'goldenQuiet',
  hopeful: 'goldenQuiet',
  proud: 'goldenQuiet',
  confident: 'goldenQuiet',
  romantic: 'goldenQuiet',

  // Open, airy positive energy.
  calm: 'firstLight',
  engaged: 'firstLight',
  wowed: 'firstLight',

  // Heated defensive states.
  angry: 'emberField',
  disgusted: 'emberField',
  frustrated: 'emberField',
  jealous: 'emberField',

  // Quiet heavy and restorative.
  anxious: 'blueHush',
  guilty: 'blueHush',
  lonely: 'blueHush',
  numb: 'blueHush',
  sad: 'blueHush',
  sick: 'blueHush',
  tired: 'blueHush',

  // Activated static and social friction.
  distracted: 'softStatic',
  embarrassed: 'softStatic',
  hungry: 'softStatic',
  shaken: 'softStatic',
  stressed: 'softStatic',
  wired: 'softStatic',

  // Intentionally isolated singletons. Do not merge these with adjacent moods.
  neutral: 'plainLight',
  unknown: 'unknownSky',
  confused: 'fogDrift',
};

export { SCENE_LIBRARY, MOOD_SCENE_KEYS };
