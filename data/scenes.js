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
  sky: '#f6e8d8',
  wash: 'rgba(255, 245, 230, 0.84)',
  celestial: '#f5c987',
  celestialHalo: 'rgba(247, 213, 155, 0.5)',
  cloud: 'rgba(255, 248, 238, 0.42)',
  mist: 'rgba(252, 243, 232, 0.42)',
  field: '#e7c8ac',
  shadow: '#9f7455',
  cueSurface: 'rgba(242, 226, 206, 0.94)',
  cueBorder: 'rgba(145, 108, 79, 0.1)',
};

const QUIET_SOFT_SCENE = {
  sky: '#ebe5eb',
  wash: 'rgba(245, 242, 247, 0.82)',
  celestial: '#ead6cc',
  celestialHalo: 'rgba(236, 216, 205, 0.42)',
  cloud: 'rgba(249, 247, 251, 0.4)',
  mist: 'rgba(242, 239, 245, 0.4)',
  field: '#d8ccd7',
  shadow: '#847989',
  cueSurface: 'rgba(232, 226, 234, 0.94)',
  cueBorder: 'rgba(110, 98, 116, 0.1)',
};

const COPPER_HAZE_SCENE = {
  sky: '#f0dfd3',
  wash: 'rgba(249, 239, 233, 0.84)',
  celestial: '#efb27f',
  celestialHalo: 'rgba(241, 179, 128, 0.46)',
  cloud: 'rgba(255, 246, 240, 0.4)',
  mist: 'rgba(245, 233, 226, 0.4)',
  field: '#dfc0af',
  shadow: '#936552',
  cueSurface: 'rgba(236, 216, 206, 0.94)',
  cueBorder: 'rgba(132, 90, 74, 0.1)',
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
  sad: 'silverHush',
  anxious: 'silverHush',
  angry: 'emberMesa',
  averse: 'stoneVeil',
  confused: 'emberMesa',
  surprised: 'opalMist',
  weird: 'opalMist',
};

export { SCENE_LIBRARY, MOOD_SCENE_KEYS };
