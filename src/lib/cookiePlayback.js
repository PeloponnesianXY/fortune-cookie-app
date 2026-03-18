import { COOKIE_ANIMATION_TYPES, COOKIE_STATIC_STATES } from '../components/FortuneCookie/animationTypes';
import { getCookiePack } from './cookieAssets';

function hasFrames(pack) {
  return Array.isArray(pack.assets?.frames) && pack.assets.frames.length > 0;
}

export function resolveCookiePlayback(packId, reducedMotion = false) {
  const pack = getCookiePack(packId);

  if (reducedMotion) {
    return { pack, mode: COOKIE_ANIMATION_TYPES.STATIC_STATE };
  }

  if (pack.type === COOKIE_ANIMATION_TYPES.IMAGE_SEQUENCE && hasFrames(pack)) {
    return { pack, mode: COOKIE_ANIMATION_TYPES.IMAGE_SEQUENCE };
  }

  if (pack.type === COOKIE_ANIMATION_TYPES.LOTTIE && pack.assets?.lottie) {
    return { pack, mode: COOKIE_ANIMATION_TYPES.LOTTIE };
  }

  return { pack, mode: COOKIE_ANIMATION_TYPES.STATIC_STATE };
}

export function getCookieImageForState(pack, state) {
  if (state === COOKIE_STATIC_STATES.OPEN) {
    return pack.assets.open || pack.assets.cracked || pack.assets.closed;
  }

  if (state === COOKIE_STATIC_STATES.CRACKED) {
    return pack.assets.cracked || pack.assets.open || pack.assets.closed;
  }

  return pack.assets.closed || pack.assets.open;
}

export function getFrameDurationMs(pack) {
  if (pack.frameIndex?.fps) {
    return Math.round(1000 / pack.frameIndex.fps);
  }

  const fps = pack.recommendedTiming?.fps || 12;
  return Math.round(1000 / fps);
}

export function getPaperOverlayStyle(pack) {
  const reveal = pack.paperReveal || {};

  return {
    x: reveal.x || 0.54,
    y: reveal.y || 0.47,
    width: reveal.width || 0.45,
    height: reveal.height || 0.18,
    rotationDeg: reveal.rotationDeg || 0,
    maskOpacity: reveal.maskOpacity ?? 0.94,
  };
}

export function getShadowStyle(pack) {
  const shadow = pack.shadow || {};
  return {
    scale: shadow.scale || 0.74,
    translateY: shadow.translateY || 0.09,
    opacity: shadow.opacity || 0.18,
  };
}
