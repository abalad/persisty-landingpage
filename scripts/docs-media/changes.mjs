// Scenes of the docs page `changes`, recorded on the current interface (see README.md).
export const version = "changes";

export const clips = [
  {
    name: "commit",
    query: "strip=collapsed&panel=changes",
    size: [1440, 900],
    async run(ui) {
      await ui.wait(300);
      await ui.click({ label: "App.tsx" }, { ms: 600, after: 200 });
      await ui.wait(900);
      await ui.click({ label: "Preparar App.tsx" }, { ms: 500, after: 200 });
      await ui.wait(500);
      await ui.click({ label: "Mensagem do commit" }, { ms: 500, after: 100 });
      await ui.type("Header e contador no plural", { delay: 45 });
      await ui.wait(200);
      await ui.press("Meta+Enter");
      await ui.wait(700);
    },
  },
  {
    name: "git",
    query: "panel=changes&strip=collapsed",
    async run(ui) {
      await ui.wait(500);
      await ui.click({ selector: ".sync__btn[data-dir=behind]" }, { ms: 800 });
      await ui.waitFor({ text: "Rebase", exact: false });
      await ui.wait(1200);
      await ui.click({ text: "Rebase", exact: false, selector: "button" }, { ms: 650 });
      await ui.waitFor({ text: "Atualiza o React para 19.3", exact: false }, 4000);
      await ui.wait(800);
      await ui.click({ selector: ".sync__btn[data-dir=ahead]" }, { ms: 650 });
      await ui.waitFor({ text: "Em dia", exact: false, selector: ".sync__even" }, 4000);
      // Off the branch line, so "Em dia" reads, and towards the commits that came in.
      await ui.move({ text: "Corrige o fuso nas datas dos pedidos", exact: false, dx: 0.85 }, 700);
    },
  },
  {
    name: "branch",
    query: "strip=collapsed",
    async run(ui) {
      await ui.wait(300);
      await ui.click({ label: "Branch:", exact: false }, { ms: 650 });
      await ui.wait(1200);
      await ui.type("feat/pagamento-pix", { delay: 65 });
      await ui.wait(900);
      await ui.press("Enter", { after: 250 });
      await ui.move({ x: ui.width * 0.45, y: ui.height * 0.3 }, 500);
      await ui.wait(500);
    },
  },
];
