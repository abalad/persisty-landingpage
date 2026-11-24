// Scenes of the docs page `sessions-and-recovery`, recorded on the current interface (see README.md).
export const version = "sessions-and-recovery";

export const clips = [
  {
    name: "restaurar",
    query: "restore=demo",
    async run(ui) {
      await ui.wait(600);
      await ui.click({ label: "⌘⇧R" }, { ms: 900, after: 200 });
      await ui.waitFor({ text: "Relatório de restauração" });
      await ui.move({ x: ui.width * 0.62, y: ui.height * 0.66 }, 700);
      await ui.wait(2100);
      await ui.click({ role: "button", text: "Fechar" }, { ms: 800 });
      await ui.wait(400);
      await ui.click({ label: "web ·", exact: false }, { ms: 800 });
      await ui.wait(1000);
    },
  },
];
