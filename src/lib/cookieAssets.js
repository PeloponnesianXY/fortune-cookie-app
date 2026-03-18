const classicCookieManifest = require('../../assets/cookie/manifests/classic-cookie.json');
const classicFrameIndex = require('../../assets/cookie/frames/classic/frame-index.json');

const cookiePacks = {
  'classic-cookie': {
    ...classicCookieManifest,
    frameIndex: classicFrameIndex,
    assets: {
      closed: require('../../assets/cookie/generated/closed/classic-cookie-closed.png'),
      cracked: require('../../assets/cookie/generated/cracked/classic-cookie-cracked.png'),
      open: require('../../assets/cookie/generated/open/classic-cookie-open.png'),
      paper: require('../../assets/cookie/generated/paper/classic-cookie-paper.png'),
      lottie: null,
      frames: [
        require('../../assets/cookie/frames/classic/classic-cookie-0001.png'),
        require('../../assets/cookie/frames/classic/classic-cookie-0002.png'),
        require('../../assets/cookie/frames/classic/classic-cookie-0003.png'),
        require('../../assets/cookie/frames/classic/classic-cookie-0004.png'),
        require('../../assets/cookie/frames/classic/classic-cookie-0005.png'),
        require('../../assets/cookie/frames/classic/classic-cookie-0006.png'),
        require('../../assets/cookie/frames/classic/classic-cookie-0007.png'),
        require('../../assets/cookie/frames/classic/classic-cookie-0008.png'),
      ],
    },
  },
};

export function getCookiePack(packId = 'classic-cookie') {
  return cookiePacks[packId] || cookiePacks['classic-cookie'];
}

export function listCookiePacks() {
  return Object.keys(cookiePacks);
}
