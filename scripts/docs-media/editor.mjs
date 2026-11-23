// Scenes of the docs page `editor`, recorded on the current interface (see README.md).
export const version = "editor";

/** Where a CodeMirror line that contains `text` ends, a little to the right: a click there puts the cursor at its end. */
const lineEnd = (text) =>
  `(() => { const line = [...document.querySelectorAll(".cm-line")].find((l) => l.textContent.includes(${JSON.stringify(text)})); if (!line) return null; const r = document.createRange(); r.selectNodeContents(line); const b = r.getBoundingClientRect(); return { x: b.right + 12, y: b.top + b.height / 2 }; })()`;

export const clips = [
  {
    name: "markdown",
    query: "open=docs/release.md&strip=collapsed",
    hold: 1800,
    async run(ui) {
      await ui.wait(400);
      await ui.click(await ui.eval(lineEnd("Textos novos da página de preços")), { ms: 850 });
      await ui.press("Enter", { show: false, after: 150 });
      await ui.type("Revisar o changelog da 2.4", { delay: 45 });
      await ui.wait(800);
      await ui.press("Meta+Shift+V");
      await ui.wait(900);
    },
  },
  {
    name: "contexto-fixo",
    query: "open=src/lib/store.ts&strip=collapsed&editor=sticky,minimap,always,scale2&lsp=fake",
    async run(ui) {
      await ui.wait(300);
      // Over the line numbers: over the code, the language server's hover would catch the wheel.
      await ui.scroll({ selector: ".cm-scroller", dx: 0.02, dy: 0.55 }, 640, { steps: 16, ms: 1500 });
      await ui.wait(1100);
      await ui.scroll(null, 260, { steps: 8, ms: 700 });
      await ui.wait(1000);
      await ui.click({ text: "dispatch(action", exact: false, selector: ".cm-sticky-line" }, { ms: 750 });
      await ui.wait(900);
    },
  },
];
