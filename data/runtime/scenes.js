/* Shared runtime scene definitions and bucket-to-scene mapping. */

const BASE_SCENE = {
  textPrimary: '#39291d',
  accent: '#8e6345',
  accentSoft: '#b28a6f',
  panel: 'rgba(255, 251, 245, 0.96)',
  panelBorder: 'rgba(146, 111, 83, 0.15)',
  input: 'rgba(255, 255, 252, 0.99)',
  inputBorder: 'rgba(149, 114, 85, 0.16)',
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

function createPaletteScene({
  backgroundDeep,
  backgroundMid,
  glow,
  accent,
  textDark,
}) {
  return {
    ...BASE_SCENE,
    sky: backgroundDeep,
    wash: hexToRgba(backgroundMid, 0.86),
    celestial: glow,
    celestialHalo: hexToRgba(glow, 0.5),
    cloud: hexToRgba(accent, 0.28),
    textPrimary: textDark,
    accent,
    accentSoft: glow,
    panel: hexToRgba(glow, 0.92),
    panelBorder: hexToRgba(textDark, 0.14),
    input: hexToRgba('#FFFFFF', 0.96),
    inputBorder: hexToRgba(accent, 0.24),
  };
}

const APRICOT_MORNING_SCENE = {
  sky: '#f7e6ce',
  wash: 'rgba(255, 244, 219, 0.86)',
  celestial: '#f8bf67',
  celestialHalo: 'rgba(249, 201, 115, 0.54)',
  cloud: 'rgba(255, 248, 234, 0.42)',
};

const SUNRISE_BLOOM_SCENE = createPaletteScene({
  backgroundDeep: '#F7C873',
  backgroundMid: '#F6A85C',
  glow: '#FFDFA3',
  accent: '#F28C8C',
  textDark: '#5C3A21',
});

const PRISM_DRIFT_SCENE = createPaletteScene({
  backgroundDeep: '#6B6FF2',
  backgroundMid: '#9A8CFF',
  glow: '#C7F0FF',
  accent: '#E7D7FF',
  textDark: '#2B2757',
});

const OPAL_MIST_SCENE = createPaletteScene({
  backgroundDeep: '#A8B7C9',
  backgroundMid: '#D9E2EA',
  glow: '#F4F7FA',
  accent: '#CFC7DF',
  textDark: '#46515E',
});

const EMBER_MESA_SCENE = createPaletteScene({
  backgroundDeep: '#8F3B2E',
  backgroundMid: '#C96B4A',
  glow: '#F2B079',
  accent: '#D94F4F',
  textDark: '#3B1E18',
});

const NEON_PULSE_SCENE = createPaletteScene({
  backgroundDeep: '#243B64',
  backgroundMid: '#3D67A8',
  glow: '#78D7FF',
  accent: '#A6F0D6',
  textDark: '#162033',
});

const SILVER_HUSH_SCENE = createPaletteScene({
  backgroundDeep: '#6E7C96',
  backgroundMid: '#9AA8BF',
  glow: '#DCE4F2',
  accent: '#C7B0BA',
  textDark: '#334055',
});

const STONE_VEIL_SCENE = createPaletteScene({
  backgroundDeep: '#5F6660',
  backgroundMid: '#8B948B',
  glow: '#C9D1C8',
  accent: '#B7C47A',
  textDark: '#2F352F',
});

const SCENE_LIBRARY = {
  apricotMorning: {
    ...BASE_SCENE,
    ...APRICOT_MORNING_SCENE,
  },
  sunriseBloom: {
    ...SUNRISE_BLOOM_SCENE,
  },
  prismDrift: {
    ...PRISM_DRIFT_SCENE,
  },
  silverHush: {
    ...SILVER_HUSH_SCENE,
  },
  emberMesa: {
    ...EMBER_MESA_SCENE,
  },
  neonPulse: {
    ...NEON_PULSE_SCENE,
  },
  stoneVeil: {
    ...STONE_VEIL_SCENE,
  },
  opalMist: {
    ...OPAL_MIST_SCENE,
  },
};

const MOOD_SCENE_KEYS = {
  affectionate: 'sunriseBloom',
  happy: 'sunriseBloom',
  hopeful: 'sunriseBloom',
  proud: 'sunriseBloom',
  calm: 'sunriseBloom',
  grateful: 'sunriseBloom',
  wowed: 'prismDrift',
  shaken: 'prismDrift',
  confused: 'opalMist',
  anxious: 'silverHush',
  angry: 'emberMesa',
  frustrated: 'emberMesa',
  sad: 'silverHush',
  disgusted: 'stoneVeil',
  lonely: 'silverHush',
  guilty: 'silverHush',
  jealous: 'emberMesa',
  embarrassed: 'opalMist',
  tired: 'silverHush',
  sick: 'silverHush',
  hungry: 'silverHush',
  wired: 'neonPulse',
  distracted: 'opalMist',
  stressed: 'neonPulse',
  neutral: 'opalMist',
  numb: 'silverHush',
  romantic: 'sunriseBloom',
  unknown: 'prismDrift',
};

export { SCENE_LIBRARY, MOOD_SCENE_KEYS };
