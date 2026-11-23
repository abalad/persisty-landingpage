// Scenes of the docs page `projects-and-workspaces`, recorded on the current interface
// (see README.md). The description of each video lives in the page's Markdown.
export const version = "projects-and-workspaces";

export const clips = [
  {
    name: "projetos",
    query: "projects=demo",
    async run(ui) {
      await ui.wait(300);
      await ui.click({ label: "web ·", exact: false }, { ms: 800 });
      await ui.wait(1100);
      await ui.click({ text: "atlas-site", selector: ".rstrip__name" }, { ms: 850 });
      await ui.wait(1200);
      await ui.click({ label: "Nimbus ·", exact: false }, { ms: 850 });
      await ui.wait(1200);
    },
  },
  {
    name: "workspace-remoto",
    query: "github=connected&strip=collapsed&clone=fresh",
    hold: 1000,
    async run(ui) {
      await ui.wait(100);
      await ui.click({ label: "Adicionar workspace" }, { ms: 650 });
      await ui.wait(400);
      await ui.click("Repositório remoto", { ms: 600 });
      await ui.waitFor({ text: "atlas-landing", exact: false });
      await ui.wait(300);
      await ui.click({ text: "atlas-landing", exact: false, nth: 0 }, { ms: 600 });
      await ui.wait(300);
      await ui.scroll({ text: "Branch padrão", exact: false }, 420, { steps: 6, ms: 400 });
      await ui.wait(250);
      await ui.click("Clonar e adicionar", { ms: 600 });
      await ui.waitFor({ text: "Pasta comum", exact: false }, 8000);
      await ui.wait(300);
    },
  },
];
