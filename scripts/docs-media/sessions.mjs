// Scenes of the docs page `sessions`, recorded on the current interface (see README.md).
export const version = "sessions";

export const clips = [
  {
    name: "painel",
    query: "strip=collapsed",
    size: [1440, 900],
    async run(ui) {
      await ui.wait(300);
      await ui.press("Meta+\\");
      await ui.wait(500);
      await ui.click({ label: "Terminal e painel" }, { ms: 550, after: 150 });
      await ui.eval("document.querySelector('.stage__divider')?.focus()");
      await ui.press("ArrowLeft", { after: 250 });
      await ui.press("ArrowLeft", { after: 400 });
      await ui.click({ label: "Alterações", role: "button" }, { ms: 550, after: 200 });
      await ui.click({ label: "App.tsx" }, { ms: 500, after: 200 });
      await ui.wait(1000);
      await ui.press("Meta+Shift+f", { after: 300 });
      await ui.type("Header", { delay: 75 });
      await ui.wait(700);
    },
  },
];
