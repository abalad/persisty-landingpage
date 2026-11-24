// Scenes of the docs page `git-in-the-editor`, recorded on the current interface (see README.md).
export const version = "git-in-the-editor";

/** Over the line numbers: over the code, the language server's hover would open. */
const gutter = { selector: ".cm-scroller", dx: 0.02, dy: 0.7 };

export const clips = [
  {
    name: "blame",
    query: "open=src/lib/store.ts&strip=collapsed&lsp=fake",
    async run(ui) {
      await ui.wait(400);
      await ui.click({ selector: ".cm-content", dx: 0.5, dy: 0.25 }, { ms: 700, after: 150 });
      await ui.move(gutter, 400);
      await ui.press("Meta+k");
      await ui.type("anotar", { delay: 80 });
      await ui.wait(500);
      await ui.press("Enter");
      await ui.wait(1000);
      await ui.click({ text: "Bruno", exact: false }, { ms: 750 });
      await ui.wait(1300);
    },
  },
];
