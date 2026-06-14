import { html } from "#html";
import { icon } from "../utils/icons.ts";

export default html`
  <template id="icon-copy">${await icon("copy")}</template>
  <template id="icon-check">${await icon("copy-check")}</template>

  <script>
    const copyIcon = document.getElementById("icon-copy").innerHTML;
    const checkIcon = document.getElementById("icon-check").innerHTML;

    document.querySelectorAll("pre.shiki").forEach((pre) => {
      const button = document.createElement("button");
      button.innerHTML = copyIcon;
      button.className = "copy-code button ghost square";
      button.ariaLabel = "Copy code";
      button.dataset.tooltip = "left";
      button.setAttribute("aria-label", "Copy code");

      button.addEventListener("click", async () => {
        const code = pre.querySelector("code")?.innerText ?? "";
        await navigator.clipboard.writeText(code);
        button.innerHTML = checkIcon;
        button.style.color = "var(--ui-constructive)";
        setTimeout(() => {
          button.innerHTML = copyIcon;
          button.style.removeProperty("color");
        }, 2000);
      });

      pre.appendChild(button);
    });
  </script>
`;
