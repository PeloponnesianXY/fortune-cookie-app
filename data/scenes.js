/* Extracted from App.js for maintainability. */

const BASE_SCENE = {
  textPrimary: '#39291d',
  accent: '#8e6345',
  accentSoft: '#b28a6f',
  panel: 'rgba(255, 251, 245, 0.96)',
  panelBorder: 'rgba(146, 111, 83, 0.15)',
  input: 'rgba(255, 255, 252, 0.99)',
  inputBorder: 'rgba(149, 114, 85, 0.16)',
  cueSurface: 'rgba(244, 231, 213, 0.94)',
  cueBorder: 'rgba(138, 105, 78, 0.1)',
  statusBar: 'dark',
  stars: [],
};

const WARM_LIGHT_SCENE = {
  sky: '#f7e6ce',
  wash: 'rgba(255, 244, 219, 0.86)',
  celestial: '#f8bf67',
  celestialHalo: 'rgba(249, 201, 115, 0.54)',
  cloud: 'rgba(255, 248, 234, 0.42)',
  mist: 'rgba(252, 241, 224, 0.44)',
  field: '#e8c49d',
  shadow: '#a36e42',
  cueSurface: 'rgba(243, 221, 191, 0.94)',
  cueBorder: 'rgba(151, 104, 66, 0.1)',
};

const QUIET_SOFT_SCENE = {
  sky: '#e7dde8',
  wash: 'rgba(241, 235, 244, 0.82)',
  celestial: '#dcb9cd',
  celestialHalo: 'rgba(221, 189, 209, 0.42)',
  cloud: 'rgba(245, 241, 248, 0.38)',
  mist: 'rgba(236, 230, 241, 0.42)',
  field: '#cfbdd0',
  shadow: '#7d677f',
  cueSurface: 'rgba(228, 217, 229, 0.94)',
  cueBorder: 'rgba(104, 86, 106, 0.1)',
};

const COPPER_HAZE_SCENE = {
  sky: '#edd4cf',
  wash: 'rgba(247, 231, 228, 0.84)',
  celestial: '#df806b',
  celestialHalo: 'rgba(226, 125, 103, 0.48)',
  cloud: 'rgba(255, 241, 238, 0.4)',
  mist: 'rgba(243, 225, 222, 0.4)',
  field: '#dbb1a8',
  shadow: '#8d4f49',
  cueSurface: 'rgba(235, 206, 201, 0.94)',
  cueBorder: 'rgba(130, 72, 67, 0.1)',
};

const STONE_VEIL_SCENE = {
  sky: '#e8e2db',
  wash: 'rgba(243, 240, 235, 0.8)',
  celestial: '#dacbb6',
  celestialHalo: 'rgba(220, 204, 184, 0.34)',
  cloud: 'rgba(246, 243, 239, 0.38)',
  mist: 'rgba(238, 235, 231, 0.38)',
  field: '#d1c6bb',
  shadow: '#7f7368',
  cueSurface: 'rgba(230, 223, 215, 0.94)',
  cueBorder: 'rgba(106, 97, 87, 0.1)',
};

const OPAL_DAY_SCENE = {
  sky: '#f0e8e7',
  wash: 'rgba(248, 243, 244, 0.84)',
  celestial: '#efc9b7',
  celestialHalo: 'rgba(241, 214, 195, 0.44)',
  cloud: 'rgba(251, 248, 248, 0.4)',
  mist: 'rgba(244, 239, 240, 0.4)',
  field: '#ddccc6',
  shadow: '#8b756d',
  cueSurface: 'rgba(235, 225, 221, 0.94)',
  cueBorder: 'rgba(110, 95, 90, 0.1)',
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
  averse: 'stoneVeil',
  confused: 'emberMesa',
  surprised: 'opalMist',
  weird: 'opalMist',
};

export { SCENE_LIBRARY, MOOD_SCENE_KEYS };
