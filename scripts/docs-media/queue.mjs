// Scenes of the docs page `queue`, recorded on the current interface (see README.md).
export const version = "queue";

export const clips = [
  {
    name: "fila",
    query: "plan=pro&queue=demo&panel=queue&strip=collapsed",
    async run(ui) {
      await ui.wait(700);
      await ui.click({ label: "Quando enviar:", exact: false }, { ms: 650, after: 200 });
      await ui.wait(400);
      await ui.click({ selector: ".queue-when__option", text: "Quando a janela de 5 h renovar", exact: false }, { ms: 500, after: 250 });
      await ui.click({ label: "O que o agente deve fazer", exact: false }, { ms: 500, after: 150 });
      await ui.type("Rode o lint e corrija os avisos", { delay: 50 });
      await ui.wait(300);
      await ui.press("Meta+Enter");
      await ui.wait(900);
    },
  },
];
