import { createEditorElementRegistry } from '../../editor/element-registry.js';
import { clampImageWidth, normalizeImagePlacement } from '../../core/image-placement.js';

function normalizeTextElement(element = {}) {
  const html = String(element.html ?? '').replaceAll('\u200b', '').trim();
  if (!html) return null;
  return {
    id: element.id ? String(element.id) : null,
    type: 'text',
    html
  };
}

function normalizeImageElement(element = {}) {
  const mediaId = Number(element.media_id);
  if (!Number.isFinite(mediaId) || mediaId <= 0) return null;

  const width = clampImageWidth(element.size?.width ?? element.width);
  return {
    id: element.id ? String(element.id) : null,
    type: 'image',
    media_id: mediaId,
    size: { width, unit: 'percent' },
    placement: normalizeImagePlacement(element.placement, width),
    ...(element.image ? { image: element.image } : {})
  };
}

const registry = createEditorElementRegistry([
  { type: 'text', create: normalizeTextElement },
  { type: 'image', create: normalizeImageElement }
]);

export function getLearningMaterialElementDefinition(type) {
  return registry.get(type);
}

export function listLearningMaterialElementDefinitions() {
  return Object.freeze(registry.list());
}

export function normalizeLearningMaterialElement(element) {
  const definition = getLearningMaterialElementDefinition(element?.type);
  return definition ? definition.create(element) : null;
}

export function normalizeLearningMaterialElements(elements = []) {
  return (Array.isArray(elements) ? elements : [])
    .map(normalizeLearningMaterialElement)
    .filter(Boolean);
}

export { normalizeTextElement, normalizeImageElement };
