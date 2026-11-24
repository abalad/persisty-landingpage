// Scenes of the docs page `files`, recorded on the current interface (see README.md).
export const version = "files";

export const clips = [
  {
    name: "arquivos",
    // `lsp=fake`: the demo's language server, so the status bar reads "TypeScript: pronto".
    query: "open=src/App.tsx&strip=collapsed&lsp=fake",
    async run(ui) {
      await ui.wait(400);
      await ui.click({ label: "Novo arquivo" }, { ms: 750 });
      await ui.wait(500);
      await ui.type("checkout.ts", { delay: 70 });
      await ui.wait(400);
      await ui.press("Enter");
      await ui.wait(1200);
    },
  },
];
