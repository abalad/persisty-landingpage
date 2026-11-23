// Scenes of the docs page `voice`, recorded on the current interface (see README.md).
export const version = "voice";

export const clips = [
  {
    name: "voz",
    query: "voice=demo&strip=collapsed",
    // Ends while "Inserido em terminal api" still shows (it goes after 1.5 s).
    hold: 1100,
    async run(ui) {
      // The keys show above the dictation pill, not over it.
      await ui.eval(`document.getElementById("__clip-keys").style.bottom = "96px"`);
      await ui.wait(300);
      await ui.click({ selector: ".terminal-view__standin", dx: 0.32, dy: 0.22 }, { ms: 850 });
      await ui.wait(700);
      await ui.press("Meta+Shift+D");
      await ui.wait(3300);
      await ui.press("Meta+Shift+D");
      await ui.waitFor({ text: "Inserido em terminal api", exact: false }, 5000);
      await ui.wait(150);
    },
  },
];
