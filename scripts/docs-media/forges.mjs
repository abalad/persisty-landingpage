// Scenes of the docs page `forges`, recorded on the current interface (see README.md).
export const version = "forges";

export const clips = [
  {
    name: "integracoes",
    query: "route=settings",
    async run(ui) {
      await ui.wait(100);
      await ui.click({ text: "Integrações", exact: false }, { ms: 750 });
      await ui.wait(1200);
      await ui.click({ text: "GitHub", exact: false, nth: 0 }, { ms: 700 });
      await ui.wait(500);
      await ui.click("Conectar conta", { ms: 650 });
      await ui.waitFor({ text: "Conta @demo conectada.", exact: false }, 8000);
      await ui.wait(300);
    },
  },
];
