import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import { safe, SafeHtml } from "#html";

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

const processor = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeShiki, {
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
    transformers: [
      {
        pre(node) {
          const meta = (this.options.meta as any)?.__raw as string | undefined;
          if (meta) node.properties.dataFilename = meta;
        },
      },
    ],
  })
  .use(rehypeCodeFilename)
  .use(rehypeStringify)
  .freeze();

export async function parseMarkdown(markdown: string): Promise<SafeHtml> {
  return safe(String(await processor.process(markdown)));
}
