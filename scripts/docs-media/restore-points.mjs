// Scenes of the docs page `restore-points`, recorded on the current interface (see README.md).
export const version = "restore-points";

export const clips = [
  {
    name: "pontos",
    query: "plan=pro&panel=restore&strip=collapsed",
    async run(ui) {
      await ui.wait(300);
      await ui.click({ label: "web ·", exact: false }, { ms: 600, after: 200 });
      await ui.wait(500);
      await ui.click({ selector: ".rp__point", text: "Adicione paginação", exact: false }, { ms: 650, after: 200 });
      await ui.wait(1100);
      await ui.click({ text: "Restaurar este ponto" }, { ms: 550, after: 200 });
      await ui.wait(800);
      await ui.click({ selector: "[role=alertdialog] button", text: "Restaurar" }, { ms: 500, after: 200 });
      await ui.move({ x: ui.width * 0.45, y: ui.height * 0.45 }, 500);
      await ui.wait(400);
    },
  },
];
