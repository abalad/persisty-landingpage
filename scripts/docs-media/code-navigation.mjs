// Scenes of the docs page `code-navigation`, recorded on the current interface (see README.md).
export const version = "code-navigation";

/** Over the line numbers: over the code, the language server's hover would open. */
const gutter = { selector: ".cm-scroller", dx: 0.02, dy: 0.7 };

export const clips = [
  {
    name: "recentes",
    query: "open=src/App.tsx,src/lib/store.ts,docs/release.md&strip=collapsed&lsp=fake",
    async run(ui) {
      await ui.wait(400);
      await ui.click({ selector: ".cm-content", dx: 0.5, dy: 0.25 }, { ms: 700, after: 150 });
      await ui.move(gutter, 400);
      await ui.press("Meta+e");
      await ui.wait(1200);
      await ui.press("ArrowDown", { after: 500 });
      await ui.press("Enter");
      await ui.wait(1200);
    },
  },
];
