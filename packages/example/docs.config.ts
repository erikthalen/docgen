import { defineDocs } from "@erikt/docgen";

export default defineDocs({
  port: 5152,
  brandColor: "light-dark(#f5c71a, #fff600)",
  siteName: "Example Docgen",
  githubLink: "https://github.com/erikthalen/docgen",
  structure: [
    { label: "Intro", path: "/intro", icon: "wand" },
    { label: "Guide", path: "/guide", icon: "book" },
    { label: "API", path: "/api", icon: "code" },
  ],
});
