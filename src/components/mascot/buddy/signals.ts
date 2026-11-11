/* Copied from the desktop app (apps/desktop/src/features/buddy/signals.ts): the reactions a terminal can ask for. */
export type Reaction = { kind: "celebrate" | "oops" | "wave" | "think" } | { kind: "say"; text: string };
