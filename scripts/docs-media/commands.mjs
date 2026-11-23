// Scenes of the docs page `commands`, recorded on the current interface (see README.md).
export const version = "commands";

export const clips = [
  {
    name: "comandos",
    query: "strip=collapsed",
    async run(ui) {
      await ui.wait(200);
      await ui.click({ label: "Comando do workspace" }, { ms: 600, after: 200 });
      await ui.wait(300);
      await ui.click({ selector: "[role=menuitemradio]", text: "pnpm test", exact: false }, { ms: 450, after: 150 });
      await ui.click({ label: "Executar" }, { ms: 450, after: 200 });
      await ui.wait(1000);
      await ui.click({ label: "Comando do workspace" }, { ms: 550, after: 200 });
      await ui.wait(250);
      await ui.click({ selector: "[role=menuitemradio]", text: "pnpm dev", exact: false }, { ms: 450, after: 150 });
      await ui.click({ label: "Executar" }, { ms: 450, after: 200 });
      await ui.wait(700);
      await ui.click({ label: "test ·", exact: false, role: "tab" }, { ms: 650, after: 200 });
    },
  },
];
