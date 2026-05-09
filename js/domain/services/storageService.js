const STORAGE_KEYS = {
  USERS: "isRegisted",
  USERS_LEGACY: "isRegistered",
  LOGGED_IN: "LoggedIn",
  COMMENTS: "petcare_comments",
  SERVICE_NAME: "serviceName",
  REVIEWS: "petcare_reviews"
};

function tryParseJSON(value, fallback) {
  if (value == null) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function readJSON(key, fallback) {
  const raw = localStorage.getItem(key);
  return tryParseJSON(raw, fallback);
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

export function getUsers() {
  const primary = normalizeArray(readJSON(STORAGE_KEYS.USERS, []));
  if (primary.length > 0) return primary;

  const legacy = normalizeArray(readJSON(STORAGE_KEYS.USERS_LEGACY, []));
  if (legacy.length > 0) {
    writeJSON(STORAGE_KEYS.USERS, legacy);
    return legacy;
  }

  return [];
}

export function setUsers(users) {
  writeJSON(STORAGE_KEYS.USERS, normalizeArray(users));
}

export function getLoggedInUser() {
  return readJSON(STORAGE_KEYS.LOGGED_IN, null);
}

export function setLoggedInUser(user) {
  writeJSON(STORAGE_KEYS.LOGGED_IN, user);
}

export function clearLoggedInUser() {
  localStorage.removeItem(STORAGE_KEYS.LOGGED_IN);
}

export function getComments() {
  return normalizeArray(readJSON(STORAGE_KEYS.COMMENTS, []));
}

export function setComments(comments) {
  writeJSON(STORAGE_KEYS.COMMENTS, normalizeArray(comments));
}

export function getReviews() {
  return normalizeArray(readJSON(STORAGE_KEYS.REVIEWS, []));
}

export function setReviews(reviews) {
  writeJSON(STORAGE_KEYS.REVIEWS, normalizeArray(reviews));
}

export function getServiceName() {
  const raw = localStorage.getItem(STORAGE_KEYS.SERVICE_NAME);
  if (!raw) return "";
  const parsed = tryParseJSON(raw, null);
  return parsed == null ? raw : parsed;
}

export function setServiceName(name) {
  localStorage.setItem(STORAGE_KEYS.SERVICE_NAME, JSON.stringify(name || ""));
}

export { STORAGE_KEYS };