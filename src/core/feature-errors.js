export function normalizeFeatureError(error, fallback = 'Er is iets misgegaan.') {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error.trim();
  if (error?.message) return String(error.message);
  return fallback;
}

export function createFeatureError(error, context = '') {
  const message = normalizeFeatureError(error);
  return new Error(context ? `${context}: ${message}` : message);
}
