// Scenes of the docs page `updates`, recorded on the current interface (see README.md).
export const version = "updates";

export const clips = [
  {
    name: "atualizar",
    query: "update=0.14.0&current=0.13.0",
    // The app looks for versions 30 s after it opens: the recording starts just before.
    settle: 29000,
    async run(ui) {
      await ui.waitFor({ text: "Persisty 0.14.0 disponível", exact: false }, 12000);
      await ui.wait(1300);
      await ui.move({ text: "Novidades", selector: "button" }, 750);
      await ui.wait(500);
      await ui.click("Instalar e reiniciar", { ms: 600 });
      await ui.waitFor({ text: "Baixando… 100%", exact: false }, 8000);
      await ui.wait(300);
    },
  },
];
