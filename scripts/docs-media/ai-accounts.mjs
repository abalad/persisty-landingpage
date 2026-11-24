// Scenes of the docs page `ai-accounts`, recorded on the current interface (see README.md).
export const version = "ai-accounts";

export const clips = [
  {
    name: "contas",
    query: "plan=pro&route=settings",
    hold: 1200,
    async run(ui) {
      await ui.wait(150);
      await ui.click({ text: "Contas de IA", exact: false }, { ms: 700 });
      await ui.wait(900);
      await ui.click("Conectar conta", { ms: 650 });
      await ui.wait(300);
      await ui.type("dev@cliente.example", { delay: 38 });
      await ui.wait(300);
      await ui.click("Entrar pelo navegador", { ms: 550 });
      await ui.waitFor({ text: "Conta conectada", exact: false }, 6000);
      await ui.wait(200);
    },
  },
  {
    name: "rodizio",
    query: "plan=pro&route=settings",
    async run(ui) {
      await ui.wait(150);
      await ui.click({ text: "Contas de IA", exact: false }, { ms: 700 });
      await ui.wait(900);
      await ui.click({ selector: ".aia__switch input[role=switch]" }, { ms: 700 });
      await ui.waitFor({ text: "Próxima no rodízio", exact: false });
      await ui.wait(1300);
      await ui.press("Escape", { after: 300 });
      await ui.press("Meta+Shift+N", { after: 600 });
      await ui.scroll({ text: "Claude Code", exact: false }, 400, { steps: 6, ms: 400 });
      await ui.move({ text: "Automática · rodízio", exact: false, selector: "select", dx: 0.93 }, 600);
      await ui.wait(300);
    },
  },
];
