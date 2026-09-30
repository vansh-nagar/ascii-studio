export function parseDevArgs(argv) {
  const baseIdx = argv.indexOf("--base");
  if (baseIdx === -1) return { base: 3000, passThrough: [...argv] };

  const value = argv[baseIdx + 1];
  const base = Number(value);
  if (!/^\d+$/.test(value ?? "") || !Number.isInteger(base) || base < 1 || base > 65535) {
    throw new Error("--base must be an integer between 1 and 65535.");
  }
  return {
    base,
    passThrough: [...argv.slice(0, baseIdx), ...argv.slice(baseIdx + 2)],
  };
}

export async function findAvailablePort(base, isFree) {
  const lastPort = Math.min(base + 99, 65535);
  for (let port = base; port <= lastPort; port++) {
    if (await isFree(port)) return port;
  }
  throw new Error(`No free port found between ${base} and ${lastPort}. Try a different --base.`);
}
