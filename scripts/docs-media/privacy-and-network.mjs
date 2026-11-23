// Scenes of the docs page `privacy-and-network`, recorded on the current interface (see README.md).
export const version = "privacy-and-network";

export const clips = [
  {
    name: "rede",
    // No workspaces, so no git fetch: the demo logs its git calls with bytes, and the app logs
    // 0 bytes for them. Asking for a sign-in code makes one POST, which sends a body in the app too.
    query: "route=settings&empty=workspaces",
    hold: 1000,
    async run(ui) {
      await ui.wait(200);
      await ui.click({ text: "Entrar", selector: "button" }, { ms: 700 });
      await ui.wait(500);
      await ui.type("voce@empresa.example", { delay: 40 });
      await ui.click({ text: "Continuar com e-mail", selector: "button" }, { ms: 550 });
      await ui.waitFor({ text: "Código de 8 dígitos", exact: false }, 5000);
      await ui.wait(400);
      await ui.press("Escape", { after: 400 });
      await ui.scroll({ text: "Uso de IA" }, 400, { ms: 400 });
      await ui.click({ text: "Privacidade e rede", exact: false }, { ms: 600 });
      await ui.wait(1300);
      await ui.move({ text: "Atualizar", selector: "button" }, 700);
    },
  },
];
