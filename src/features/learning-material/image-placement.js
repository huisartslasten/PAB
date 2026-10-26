import {
  clampImageWidth,
  normalizeImagePlacement,
  migrateLegacyPlacement
} from '../../core/image-placement.js';

export { clampImageWidth, normalizeImagePlacement, migrateLegacyPlacement };

export function placementStyle(placement, width) {
  const safeWidth = clampImageWidth(width);
  const normalized = normalizeImagePlacement(placement, safeWidth);
  if (normalized.wrap === 'none') {
    return `width:${safeWidth}%;margin-left:${normalized.x}%;margin-top:${normalized.y}px;float:none;`;
  }
  const right = normalized.x > 0;
  return `width:${safeWidth}%;margin-left:${right ? 18 : 0}px;margin-right:${right ? 0 : 18}px;margin-top:0;float:${right ? 'right' : 'left'};`;
}
