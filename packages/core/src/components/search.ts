import { html } from "#html";
import { icon } from "../utils/icons.ts";

export const searchTrigger = html`
  <button class="button outlined search-trigger" style="min-width: 160px">
    ${await icon("search")} Search...

    <kbd>⌘k</kbd>
  </button>
`;

export const searchDialog = html`
  <dialog id="search-dialog">
    <article>
      <header>
        <label>
          <span data-prefix>${await icon("search")}</span>

          <input
            id="search-input"
            type="search"
            placeholder="Search documentation..."
            autocomplete="off"
            spellcheck="false"
          />
        </label>
      </header>

      <section id="search-popular" hidden>
        <menu>
          <li><small>Pages</small></li>

          <span id="search-popular-list" style="display: contents"></span>
        </menu>
      </section>

      <section id="search-results-section" hidden>
        <ul id="search-results"></ul>
        <div id="search-empty" hidden class="empty">
          ${await icon("file-off")}
          <h3>No results found</h3>
          <p>
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
        </div>
      </section>
    </article>
  </dialog>

  <script type="module" src="/search.js"></script>
`;
