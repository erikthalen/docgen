import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import { safe, SafeHtml } from "#html";

function parseYaml(yaml: string): Record<string, string> {
  const data: Record<string, string> = {};
  for (const line of yaml.split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line
      .slice(colon + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key) data[key] = value;
  }
  return data;
}

function textContent(node: any): string {
  if (node.type === "text") return node.value;
  return (node.children ?? []).map(textContent).join("");
}

function remarkExtractFrontmatter() {
  return (tree: any, file: any) => {
    const yaml = tree.children.find((n: any) => n.type === "yaml");
    const frontmatter = yaml ? parseYaml(yaml.value) : {};
    if (!frontmatter.description) {
      const para = tree.children.find((n: any) => n.type === "paragraph");
      if (para) frontmatter.description = textContent(para).trim();
    }
    file.data.frontmatter = frontmatter;
  };
}

export interface ParsedPage {
  html: SafeHtml;
  frontmatter: Record<string, string>;
}

function rehypeCodeFilename() {
  return (tree: any) => {
    function walk(node: any, parent: any, index: number) {
      if (node.type === "element" && node.tagName === "pre") {
        const filename = node.properties?.dataFilename as string | undefined;
        if (filename && parent) {
          delete node.properties.dataFilename;
          parent.children.splice(index, 0, {
            type: "element",
            tagName: "div",
            properties: { className: ["code-filename"] },
            children: [{ type: "text", value: filename }],
          });
        }
      }
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          walk(node.children[i], node, i);
        }
      }
    }
    walk(tree, null, 0);
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkFrontmatter)
  .use(remarkExtractFrontmatter)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeShiki, {
    langs: [
      "javascript",
      "typescript",
      "jsx",
      "tsx",
      "html",
      "css",
      "json",
      "yaml",
      "toml",
      "bash",
      "sh",
      "markdown",
      "python",
      "rust",
      "go",
    ],
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
    transformers: [
      {
        pre(node) {
          node.properties["x-data"] = "copyCode";
          const meta = (this.options.meta as any)?.__raw as string | undefined;
          if (meta) node.properties.dataFilename = meta;
        },
      },
    ],
  })
  .use(rehypeCodeFilename)
  .use(rehypeStringify)
  .freeze();

export async function parseMarkdown(markdown: string): Promise<ParsedPage> {
  const file = await processor.process(markdown);
  const frontmatter = (file.data.frontmatter ?? {}) as Record<string, string>;
  return { html: safe(String(file)), frontmatter };
}
