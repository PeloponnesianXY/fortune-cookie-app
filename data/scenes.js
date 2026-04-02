/* Extracted from App.js for maintainability. */

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

const WARM_LIGHT_SCENE = {
  sky: '#f7e6ce',
  wash: 'rgba(255, 244, 219, 0.86)',
  celestial: '#f8bf67',
  celestialHalo: 'rgba(249, 201, 115, 0.54)',
  cloud: 'rgba(255, 248, 234, 0.42)',
};

const QUIET_SOFT_SCENE = {
  sky: '#e7dde8',
  wash: 'rgba(241, 235, 244, 0.82)',
  celestial: '#dcb9cd',
  celestialHalo: 'rgba(221, 189, 209, 0.42)',
  cloud: 'rgba(245, 241, 248, 0.38)',
};

const COPPER_HAZE_SCENE = {
  sky: '#edd4cf',
  wash: 'rgba(247, 231, 228, 0.84)',
  celestial: '#df806b',
  celestialHalo: 'rgba(226, 125, 103, 0.48)',
  cloud: 'rgba(255, 241, 238, 0.4)',
};

const STONE_VEIL_SCENE = {
  sky: '#e8e2db',
  wash: 'rgba(243, 240, 235, 0.8)',
  celestial: '#dacbb6',
  celestialHalo: 'rgba(220, 204, 184, 0.34)',
  cloud: 'rgba(246, 243, 239, 0.38)',
};

const OPAL_DAY_SCENE = {
  sky: '#f0e8e7',
  wash: 'rgba(248, 243, 244, 0.84)',
  celestial: '#efc9b7',
  celestialHalo: 'rgba(241, 214, 195, 0.44)',
  cloud: 'rgba(251, 248, 248, 0.4)',
};

const SCENE_LIBRARY = {
  apricotMorning: {
    ...BASE_SCENE,
    ...OPAL_DAY_SCENE,
  },
  sunriseBloom: {
    ...BASE_SCENE,
    ...WARM_LIGHT_SCENE,
  },
  silverHush: {
    ...BASE_SCENE,
    ...QUIET_SOFT_SCENE,
  },
  emberMesa: {
    ...BASE_SCENE,
    ...COPPER_HAZE_SCENE,
  },
  stoneVeil: {
    ...BASE_SCENE,
    ...STONE_VEIL_SCENE,
  },
  opalMist: {
    ...BASE_SCENE,
    ...OPAL_DAY_SCENE,
  },
};

const MOOD_SCENE_KEYS = {
  happy: 'sunriseBloom',
  hopeful: 'sunriseBloom',
  calm: 'sunriseBloom',
  tired: 'silverHush',
  lonely: 'opalMist',
  sad: 'silverHush',
  anxious: 'silverHush',
  angry: 'emberMesa',
  disgusted: 'stoneVeil',
  confused: 'emberMesa',
  surprised: 'opalMist',
  weird: 'opalMist',
};

export { SCENE_LIBRARY, MOOD_SCENE_KEYS };
