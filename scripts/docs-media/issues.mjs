// Scenes of the docs page `issues`, recorded on the current interface (see README.md).
export const version = "issues";

/** Chooses `value` in a native select (its list does not draw in headless Chrome): the cursor goes there, clicks, and the value changes. */
async function pick(ui, selector, value) {
  await ui.move({ selector }, 750);
  const at = await ui.find({ selector });
  await ui.wait(120);
  await ui.eval(`__clip.ring(${at.x}, ${at.y})`);
  await ui.eval(
    `(() => { const el = document.querySelector(${JSON.stringify(selector)}); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(el, ${JSON.stringify(value)}); el.dispatchEvent(new Event("change", { bubbles: true })); })()`,
  );
}

export const clips = [
  {
    name: "issue",
    query: "plan=pro&trackers=connected",
    async run(ui) {
      await ui.wait(200);
      await ui.press("Meta+Shift+N");
      await ui.wait(700);
      await ui.scroll({ text: "Claude Code", exact: false }, 400, { steps: 8, ms: 550 });
      await ui.wait(250);
      await ui.click("Escolher issue", { ms: 650 });
      await ui.waitFor({ text: "ENG-123", exact: false });
      await ui.wait(600);
      await ui.click({ text: "Ajustar o botão de login que some no cadastro", exact: false }, { ms: 650 });
      await ui.wait(1000);
      await ui.click("Criar e abrir", { ms: 750 });
      await ui.waitFor({ text: "Resolva a issue ENG-123", exact: false }, 4000);
      await ui.wait(400);
    },
  },
  {
    name: "concluir",
    query: "trackers=connected&issue=done",
    async run(ui) {
      await ui.wait(500);
      await ui.click({ text: "Concluir", selector: "button" }, { ms: 850 });
      await ui.waitFor({ text: "Concluir ENG-123", exact: false });
      await ui.wait(1500);
      await pick(ui, "select", "s-3");
      await ui.wait(1000);
      await ui.click("Enviar", { ms: 700 });
      await ui.wait(900);
    },
  },
];
