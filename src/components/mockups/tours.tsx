"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { EditorMock } from "./EditorMock";
import { ProjectsMock, StatesMock } from "./ProjectsMock";
import { Window } from "./parts";
import { focusShot, READ_ZOOM, type Rect, type Shot, type Size } from "./tour";
import { TOUR_QUERY, WindowTour, type TourChapter, type TourCopy } from "./WindowTour";
import s from "./app.module.css";
import x from "./extra.module.css";

type Part = (className: string) => Rect | null;

/** The open session from its header down, read from its left edge. */
function session(view: Size, stage: Size, part: Part): Shot | null {
  const header = part(s.sessionHeader);
  const terminal = part(s.terminal);
  if (!header || !terminal) return null;
  return focusShot(view, stage, { x: terminal.x, y: header.y, w: terminal.w, h: terminal.y + terminal.h - header.y }, READ_ZOOM, "start", 0);
}

const PROJECTS: TourChapter[] = [
  { key: "overview", ms: 2400 },
  {
    key: "projects",
    ms: 2800,
    // The list at the app's own size, from the top of the sidebar.
    frame: (view, stage, part) => {
      const side = part(x.sidebar);
      return side ? focusShot(view, stage, { x: 0, y: 0, w: view.w, h: Math.min(side.h, 240) }, 1, "start", 0) : null;
    },
  },
  { key: "session", ms: 3000, frame: session },
  {
    key: "workspaces",
    ms: 2800,
    frame: (view, stage, part) => {
      const card = part(s.cardActive) ?? part(s.strip);
      return card ? focusShot(view, stage, card, READ_ZOOM) : null;
    },
  },
];

const STATES: TourChapter[] = [
  { key: "overview", ms: 2400 },
  {
    key: "agents",
    ms: 3200,
    // The agents' list under the projects, three rows and its heading.
    frame: (view, stage, part) => {
      const agent = part(x.agent);
      return agent ? focusShot(view, stage, { x: 0, y: agent.y - 36, w: view.w, h: agent.h * 3 + 36 }, 1, "start", 0) : null;
    },
  },
  { key: "permission", ms: 3400, frame: session },
];

const EDITOR: TourChapter[] = [
  { key: "overview", ms: 2400 },
  {
    key: "files",
    ms: 2800,
    frame: (view, stage, part) => {
      const tree = part(x.tree);
      return tree ? focusShot(view, stage, { x: 0, y: tree.y, w: view.w, h: tree.h }, 1, "start", 0) : null;
    },
  },
  {
    key: "code",
    ms: 3000,
    frame: (view, stage, part) => {
      const code = part(x.code);
      return code ? focusShot(view, stage, code, READ_ZOOM, "start", 0) : null;
    },
  },
  {
    key: "changes",
    ms: 2800,
    frame: (view, stage, part) => {
      const panel = part(x.sideFill);
      return panel ? focusShot(view, stage, panel, 1) : null;
    },
  },
];

/** The window as it is on wider screens, or toured on a phone. */
function Toured({ copy, chapters, children }: { copy: TourCopy; chapters: TourChapter[]; children: ReactNode }) {
  const toured = useMediaQuery(TOUR_QUERY);
  return toured ? <WindowTour copy={copy} chapters={chapters} render={() => children} /> : children;
}

export function ProjectsWindow() {
  const m = useTranslations("mock");
  return (
    <Toured copy={m.raw("tours.projects") as TourCopy} chapters={PROJECTS}>
      <Window label={m("projects.label")}>
        <ProjectsMock />
      </Window>
    </Toured>
  );
}

export function StatesWindow() {
  const m = useTranslations("mock");
  return (
    <Toured copy={m.raw("tours.states") as TourCopy} chapters={STATES}>
      <Window label={m("projects.label")}>
        <StatesMock />
      </Window>
    </Toured>
  );
}

export function EditorWindow() {
  const m = useTranslations("mock");
  return (
    <Toured copy={m.raw("tours.editor") as TourCopy} chapters={EDITOR}>
      <Window label={m("editor.label")}>
        <EditorMock />
      </Window>
    </Toured>
  );
}
