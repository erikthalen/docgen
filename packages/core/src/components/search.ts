import { html } from "#html";
import { icon } from "../utils/icons.ts";

export const searchTrigger = html`
  <button
    class="button ghost square search-trigger"
    aria-label="Search"
    data-tooltip="bottom"
  >
    ${await icon("search")}
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
        <p class="search-section-label">Pages</p>
        <ul id="search-popular-list"></ul>
      </section>

      <section id="search-results-section" hidden class="empty">
        ${await icon("file-off")}
        <h3>No results found</h3>
        <p>
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </section>
    </article>
  </dialog>

  <script type="module">
    import MiniSearch from "minisearch";

    const dialog = document.getElementById("search-dialog");
    const input = document.getElementById("search-input");
    const popularSection = document.getElementById("search-popular");
    const popularList = document.getElementById("search-popular-list");
    const resultsSection = document.getElementById("search-results-section");
    const resultsList = document.getElementById("search-results");
    const emptyMsg = document.getElementById("search-empty");

    let searchIndex = null;
    let popularItems = [];

    function esc(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function resultHtml(r) {
      return (
        '<li><a href="' +
        esc(r.id) +
        '" class="search-result">' +
        '<span class="search-result-title">' +
        esc(r.title) +
        "</span>" +
        '<span class="search-result-route">' +
        esc(r.id === "/" ? "Home" : r.id) +
        "</span>" +
        "</a></li>"
      );
    }

    async function loadIndex() {
      if (searchIndex) return;
      const res = await fetch("/search-index.json");
      const data = await res.json();
      searchIndex = MiniSearch.loadJSON(data.index, {
        fields: ["title", "content"],
        storeFields: ["title", "id"],
      });
      popularItems = data.popular || [];
      popularList.innerHTML = popularItems.map(resultHtml).join("");
    }

    function showPopular() {
      popularSection.hidden = popularItems.length === 0;
      resultsSection.hidden = true;
    }

    function showResults(items, query) {
      popularSection.hidden = true;
      resultsSection.hidden = false;
      resultsList.innerHTML = items.map(resultHtml).join("");
      emptyMsg.hidden = !query || items.length > 0;
    }

    async function openSearch() {
      dialog.showModal();
      input.focus();
      await loadIndex();
      if (!input.value.trim()) showPopular();
    }

    document.querySelectorAll(".search-trigger").forEach((btn) => {
      btn.addEventListener("click", openSearch);
    });

    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    });

    input.addEventListener("input", async (e) => {
      const query = e.target.value.trim();
      if (!query) {
        showPopular();
        return;
      }
      await loadIndex();
      const items = searchIndex
        .search(query, { boost: { title: 2 }, fuzzy: 0.2, prefix: true })
        .slice(0, 8);
      showResults(items, query);
    });

    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });

    [popularList, resultsList].forEach((list) => {
      list.addEventListener("click", (e) => {
        if (e.target.closest("a")) dialog.close();
      });
    });

    dialog.addEventListener("close", () => {
      input.value = "";
      popularSection.hidden = true;
      resultsSection.hidden = true;
    });
  </script>
`;
