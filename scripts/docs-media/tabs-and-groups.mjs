// Scenes of the docs page `tabs-and-groups`, recorded on the current interface (see README.md).
export const version = "tabs-and-groups";

/** Over the line numbers: over the code, the language server's hover would open. */
const gutter = { selector: ".cm-scroller", dx: 0.02, dy: 0.7 };

export const clips = [
  {
    name: "dividir",
    query: "open=src/App.tsx,src/lib/store.ts&strip=collapsed&lsp=fake",
    async run(ui) {
      await ui.wait(400);
      await ui.click({ label: "Maximizar o editor" }, { ms: 750 });
      await ui.wait(600);
      await ui.click({ selector: ".cm-content", dx: 0.5, dy: 0.25 }, { ms: 600, after: 150 });
      await ui.move(gutter, 400);
      await ui.press("Meta+k");
      await ui.type("dividir à direita", { delay: 60 });
      await ui.wait(600);
      await ui.press("Enter");
      await ui.wait(1500);
    },
  },
];
