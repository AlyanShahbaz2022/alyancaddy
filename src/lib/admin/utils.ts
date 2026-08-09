export function getAtPath(source: unknown, path: string): unknown {
  let current: unknown = source;
  for (const part of path.split(".")) {
    if (
      current === null ||
      typeof current !== "object" ||
      !(part in (current as Record<string, unknown>))
    ) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function setAtPath(source: unknown, path: string, value: unknown): unknown {
  const clone = structuredClone(source);
  const parts = path.split(".");
  let current = clone as Record<string, unknown>;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    if (current[part] === null || typeof current[part] !== "object") {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
  return clone;
}

export function moveItem(source: unknown[], index: number, direction: -1 | 1): unknown[] {
  const next = [...source];
  const target = index + direction;
  if (target < 0 || target >= next.length) {
    return next;
  }
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}