import { safe, SafeHtml } from "#html";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

const TABLER_CDN = "https://cdn.jsdelivr.net/npm/@tabler/icons/icons";
const cachePath = resolve("node_modules/.cache/docgen/icons.json");

const memCache: Record<string, string> = {};

function readCache(): Record<string, string> {
  try {
    return JSON.parse(readFileSync(cachePath, "utf-8"));
  } catch {
    return {};
  }
}

export async function icon(name: string): Promise<SafeHtml> {
  if (memCache[name]) return safe(memCache[name]);

  const diskCache = readCache();
  if (diskCache[name]) {
    memCache[name] = diskCache[name];
    return safe(diskCache[name]);
  }

  const res = await fetch(`${TABLER_CDN}/${name}.svg`);
  const svg = res.ok ? await res.text() : "";

  memCache[name] = svg;

  const latest = readCache();
  latest[name] = svg;
  mkdirSync(dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, JSON.stringify(latest));

  return safe(svg);
}
