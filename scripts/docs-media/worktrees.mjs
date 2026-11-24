// Scenes of the docs page `worktrees`, recorded on the current interface (see README.md).
export const version = "worktrees";

export const clips = [
  {
    name: "pasta-propria",
    query: "plan=pro",
    async run(ui) {
      await ui.wait(300);
      await ui.press("Meta+Shift+n");
      await ui.wait(500);
      await ui.scroll({ selector: ".dialog__body" }, 420, { ms: 500 });
      await ui.click({ selector: "input[value^='Claude Code']" }, { ms: 550, after: 100 });
      await ui.eval("document.activeElement.select()");
      await ui.wait(250);
      await ui.type("Pagamento Pix", { delay: 55 });
      await ui.click({ selector: "[role=dialog] input[role=switch]" }, { ms: 550, after: 200 });
      await ui.wait(1100);
      await ui.click({ text: "Criar e abrir" }, { ms: 550, after: 200 });
      await ui.move({ x: ui.width * 0.5, y: ui.height * 0.35 }, 500);
      await ui.wait(500);
    },
  },
];
