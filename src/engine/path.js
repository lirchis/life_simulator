export function getPath(target, path) {
  return path.split(".").reduce((value, key) => value?.[key], target);
}

export function setPath(target, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const parent = keys.reduce((object, key) => {
    if (!object[key]) object[key] = {};
    return object[key];
  }, target);
  parent[last] = value;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
