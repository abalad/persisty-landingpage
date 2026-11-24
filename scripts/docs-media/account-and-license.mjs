// Scenes of the docs page `account-and-license`, recorded on the current interface (see README.md).
export const version = "account-and-license";

export const clips = [
  {
    name: "entrar",
    // The demo signs in with the code 12345678.
    query: "route=settings",
    async run(ui) {
      await ui.wait(300);
      await ui.click({ text: "Entrar", selector: "button" }, { ms: 750 });
      await ui.wait(600);
      await ui.type("voce@empresa.example", { delay: 45 });
      await ui.wait(300);
      await ui.click({ text: "Continuar com e-mail", selector: "button" }, { ms: 600 });
      await ui.waitFor({ text: "Código de 8 dígitos", exact: false }, 5000);
      await ui.wait(500);
      await ui.click({ selector: ".auth__code" }, { ms: 600, after: 200 });
      await ui.type("12345678", { delay: 80 });
      await ui.wait(1400);
    },
  },
];
