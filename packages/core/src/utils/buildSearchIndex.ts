import MiniSearch from "minisearch";
import type { SafeHtml } from "#html";

function stripHtml(str: string): string {
  return str.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractTitle(str: string): string {
  const match = str.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!match) return "";
  return match[1].replace(/<[^>]+>/g, "").trim();
}

export function buildSearchIndex(routes: Map<string, SafeHtml>): string {
  const search = new MiniSearch({
    fields: ["title", "content"],
    storeFields: ["title", "id"],
  });

  const docs = [...routes.entries()].map(([route, content]) => ({
    id: route,
    title: extractTitle(content.value) || (route === "/" ? "Home" : route.slice(1)),
    content: stripHtml(content.value),
  }));

  search.addAll(docs);

  const popular = docs.map(({ id, title }) => ({ id, title }));

  return JSON.stringify({ index: JSON.stringify(search), popular });
}
