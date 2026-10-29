import type { ReactNode } from "react";
import s from "./app.module.css";

/*
 * The made-up projects the windows show, each with a logo of its own, the
 * way people set one on a project in the app (an uploaded logo fills its
 * tile). Invented names and marks, none a real company's. Drawn on a 32
 * square, edge to edge: the tile's border and corners frame them.
 */
export type ProjectKey = "rota" | "quintal" | "bussola" | "mare" | "pulso" | "vela";

const W = "#ffffff";

const LOGOS: Record<ProjectKey, { name: string; art: ReactNode }> = {
  // Freight by postcode: a route between two stops.
  rota: {
    name: "Rota",
    art: (
      <>
        <rect width="32" height="32" fill="#3460e6" />
        <path d="M9 23c0-7 14-4 14-12" fill="none" stroke={W} strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="9" cy="23.5" r="2.6" fill={W} />
        <circle cx="23" cy="9.5" r="3.3" fill="#ffd23f" />
      </>
    ),
  },
  // A shop's catalogue: a sprout.
  quintal: {
    name: "Quintal",
    art: (
      <>
        <rect width="32" height="32" fill="#17915a" />
        <path d="M16 25v-9" stroke={W} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M16 18c-5.5 0-7.5-4.2-7-8 4 0 7 2.8 7 8z" fill={W} />
        <path d="M16 16c4.8 0 7-3.6 6.6-7.2-3.6 0-6.6 2.6-6.6 7.2z" fill="#b8f0cf" />
      </>
    ),
  },
  // A compass needle, north in red.
  bussola: {
    name: "Bússola",
    art: (
      <>
        <rect width="32" height="32" fill="#1c2742" />
        <g transform="rotate(38 16 16)">
          <path d="M16 5.5l4 10.5h-8z" fill="#f05252" />
          <path d="M12 16h8l-4 10.5z" fill={W} />
        </g>
        <circle cx="16" cy="16" r="1.5" fill="#1c2742" />
      </>
    ),
  },
  // Tides: two waves.
  mare: {
    name: "Maré",
    art: (
      <>
        <rect width="32" height="32" fill="#0e9fb0" />
        <path d="M5.5 13.5c2.6-3 5-3 7 0s4.4 3 7 0 4.4-3 7 0" fill="none" stroke={W} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M5.5 20.5c2.6-3 5-3 7 0s4.4 3 7 0 4.4-3 7 0" fill="none" stroke={W} strokeOpacity="0.62" strokeWidth="2.4" strokeLinecap="round" />
      </>
    ),
  },
  // A heartbeat.
  pulso: {
    name: "Pulso",
    art: (
      <>
        <rect width="32" height="32" fill="#e5484d" />
        <path d="M5 17h5l2.6-6.5 4.2 12 3-8.5 1.6 3H27" fill="none" stroke={W} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  // A sailboat.
  vela: {
    name: "Vela",
    art: (
      <>
        <rect width="32" height="32" fill="#f2a516" />
        <path d="M17 6.5v14h8z" fill={W} />
        <path d="M15 9.5v11H8.5z" fill={W} fillOpacity="0.85" />
        <path d="M7 22.5h18l-3.2 4h-11.6z" fill="#5b3706" />
      </>
    ),
  },
};

export const projectName = (key: ProjectKey) => LOGOS[key].name;

/** A project's logo, filling the tile it sits in (which must be positioned). */
export function ProjectLogo({ project }: { project: ProjectKey }) {
  return (
    <span className={s.logo}>
      <svg viewBox="0 0 32 32" aria-hidden="true">
        {LOGOS[project].art}
      </svg>
    </span>
  );
}
