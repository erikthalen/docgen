import { html, safe, SafeHtml } from "#html";
import { icon } from "../utils/icons.ts";
import schemeToggle from "./scheme-toggle.ts";
import { searchTrigger } from "./search.ts";

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

async function buildNav(
  routes: Map<string, SafeHtml>,
  structure?: NavItem[],
): Promise<SafeHtml> {
  if (!structure) {
    return safe(
      [...routes.keys()]
        .map(
          (route) =>
            `<a href="${route}" class="button ghost">${route === "/" ? "home" : route.slice(1)}</a>`,
        )
        .join("\n"),
    );
  }

  const links = await Promise.all(
    structure.map(async ({ label, path, icon: iconName }) => {
      const svg = await icon(iconName);
      return `<a href="${path}" class="button ghost">${svg.value}${label}</a>`;
    }),
  );

  return safe(links.join("\n"));
}

export async function siteHeader(
  routes: Map<string, SafeHtml>,
  structure?: NavItem[],
): Promise<SafeHtml> {
  const nav = await buildNav(routes, structure);

  return html`
    <header>
      <a href="/" aria-label="Homepage">
        <img src="/logo.jpg" />
      </a>

      <nav>${nav}</nav>

      <aside>
        ${searchTrigger}
        ${schemeToggle}

        <a
          id="github-link"
          href="https://github.com/erikthq/ui"
          target="_blank"
          rel="noopener"
          class="button secondary square"
          aria-label="GitHub"
          data-tooltip="bottom"
        >
          ${await icon("brand-github")}
        </a>
      </aside>
    </header>
  `;
}
