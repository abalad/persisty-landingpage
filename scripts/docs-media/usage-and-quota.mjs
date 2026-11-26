// Scenes of the docs page `usage-and-quota`, recorded on the current interface (see README.md).
export const version = "usage-and-quota";

export const clips = [
  {
    name: "uso",
    query: "usage=demo",
    async run(ui) {
      await ui.wait(300);
      await ui.press("Meta+k");
      await ui.type("uso", { delay: 90 });
      await ui.wait(500);
      await ui.press("Enter");
      // Since 0.15.0 the palette's "Uso de IA — todos os projetos" opens straight on all projects.
      await ui.wait(2200);
      await ui.scroll({ text: "Por projeto" }, 300, { ms: 700 });
      await ui.wait(1600);
    },
  },
];
