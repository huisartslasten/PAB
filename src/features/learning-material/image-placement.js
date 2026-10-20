const MIN_IMAGE_WIDTH = 20;
const MAX_IMAGE_WIDTH = 100;
const MIN_IMAGE_Y = -10000;
const MAX_IMAGE_Y = 10000;

export function clampImageWidth(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(MAX_IMAGE_WIDTH, Math.max(MIN_IMAGE_WIDTH, Math.round(n))) : 100;
}

export function clampImageX(value, width) {
  const safeWidth = clampImageWidth(width);
  const max = Math.max(0, 100 - safeWidth);
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(0, Math.round(n))) : Math.round(max / 2);
}

export function clampImageY(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(MAX_IMAGE_Y, Math.max(MIN_IMAGE_Y, Math.round(n))) : 0;
}

export function normalizeImagePlacement(value, width) {
  const source = value && typeof value === 'object' ? value : {};
  const safeWidth = clampImageWidth(width);
  const maxX = Math.max(0, 100 - safeWidth);
  const wrap = source.wrap === 'none' ? 'none' : 'square';
  const rawX = clampImageX(source.x, safeWidth);
  return {
    mode: 'flow',
    x: wrap === 'square' ? (rawX > maxX / 2 ? maxX : 0) : rawX,
    y: wrap === 'square' ? 0 : clampImageY(source.y),
    wrap
  };
}

export function placementStyle(placement, width) {
  const safeWidth = clampImageWidth(width);
  const normalized = normalizeImagePlacement(placement, safeWidth);
  if (normalized.wrap === 'none') {
    return `width:${safeWidth}%;margin-left:${normalized.x}%;margin-top:${normalized.y}px;float:none;`;
  }
  const right = normalized.x > 0;
  return `width:${safeWidth}%;margin-left:${right ? 18 : 0}px;margin-right:${right ? 0 : 18}px;margin-top:0;float:${right ? 'right' : 'left'};`;
}

export function migrateLegacyPlacement(value, width) {
  const source = value && typeof value === 'object' ? value : {};
  const safeWidth = clampImageWidth(width);
  const offset = Number(source.offset) || 0;
  if (source.side === 'right') return normalizeImagePlacement({ x: 100 - safeWidth - offset }, safeWidth);
  if (source.side === 'left') return normalizeImagePlacement({ x: offset }, safeWidth);
  return normalizeImagePlacement({ x: 0 }, safeWidth);
}
