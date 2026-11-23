// Scenes of the docs page `privacy-and-network`, recorded on the current interface (see README.md).
export const version = "privacy-and-network";

export const clips = [
  {
    name: "rede",
    // No workspaces, so no git fetch: the demo logs its git calls with bytes, and the app logs
    // 0 bytes for them. A search in the MCP registry makes the call the log then shows.
    query: "route=settings&empty=workspaces",
    hold: 1200,
    async run(ui) {
      await ui.wait(300);
      await ui.click({ text: "Servidores MCP", exact: false }, { ms: 650 });
      await ui.wait(600);
      await ui.click({ label: "Buscar um serviço (Sentry, Postgres, Notion…)" }, { ms: 600 });
      await ui.type("sentry", { delay: 55 });
      await ui.waitFor({ text: "No registro oficial", exact: false }, 5000);
      await ui.wait(500);
      await ui.scroll({ text: "Uso de IA" }, 400, { ms: 400 });
      await ui.click({ text: "Privacidade e rede", exact: false }, { ms: 650 });
      await ui.wait(1300);
      await ui.move({ text: "Atualizar", selector: "button" }, 700);
    },
  },
];
