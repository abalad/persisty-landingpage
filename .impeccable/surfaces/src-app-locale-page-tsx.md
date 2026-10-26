---
version: 1
slug: "src-app-locale-page-tsx"
primary_target: "src/app/[locale]/page.tsx"
related_targets: ["src/components/site"]
---

## Scope

Home page of the Persist website (`src/app/[locale]/page.tsx`) and the shared chrome (nav, footer) every route inherits. Visitor mode: Persuade. Pricing and Download are Persuade too; Docs and Changelog are Read and inherit the world without the theatre.

## Audience, job, action

Developers who run Claude Code and Codex all day across several products and accounts; companies who pay for those accounts. Job: decide in seconds whether Persist solves crashes, disorder and account juggling. Action: download (notify while no public build) or create an account; companies talk to us.

## Proof and constraints

Proof is the product itself rendered in HTML at full fidelity, using the app's real vocabulary and layout. Demo projects are fictional (Rota, Quintal, Bússola). No testimonials, logos, counts or benchmarks exist. Availability labels: Available / In development / Planned.

## Direction contract

THESIS: The page is the product running. A faithful, live HTML rendition of Persist's own window carries every claim; it refuses the category default of gradient hero, icon-card feature grid and logo wall.

OWN-WORLD: The app's graphite (#0f1115 window ground, #151821 surfaces, #262b37 hairlines) on a page ground one step darker, #0a0c10, so every app window reads as an object on the page, the way the app reads on a desktop; one lime (#C6F24E, Persisty identity since 2026-10-22) reserved for alive and action, also filling the primary pill, status hues (blue working, amber waiting, green idle) always with icon and word. Mona Sans light at display sizes, regular in UI; JetBrains Mono only inside terminals and code. Window frames: 1px hairline, 10px radius, soft offset shadow. Pills: lime primary with dark text, graphite secondary.

STORY: The visitor understands Persist keeps agents alive, organised by project, and working across accounts; believes it by watching it recover from a simulated crash and route a session to the roomiest account; downloads or creates an account. Companies read an honest roadmap and talk to us.

FIRST VIEWPORT (two columns since 2026-10-22, the user's request with a product-shot reference: "dividir em 2 colunas uma com o 3d e outra com as descricoes"): Nav 64px. Left (lightened 2026-10-23 at the user's request, nothing removed: "muito carregado... sem tirar elementos, apenas reposicionar ou encurtar"): headline in three lines at up to 50px, light; one short sentence naming the three pains; two pills (download for the detected OS, create free account); a muted link with an accent arrow to the crash demo; two short facts with icons side by side over a hairline (code stays on the machine; free core, public builds soon). Right: the desktop app's clay studio in live 3D, cards pinned to the agent, tests, dev server and deploy, their lines changing; phones run it live too; reduced motion, Save-Data and devices under 4 GB keep its still frame. Below both, the app window begins above the fold, agents changing state and the status bar's 5h and 7d bars live. Signature interaction: "Crash the computer" / "Quit Persist" in the recovery section, the first section after the agents strip, entered from that first-viewport link: the window collapses to black, Persist reopens and sessions return one by one with their resume command; reduced motion swaps states instantly.

FORM: Brief-pinned structure (verne.build: centred statement, product window, two-column section heads over mockups) inside the app's established world. No seed: the user pinned it in their own words, "eu quero o site no estilo do verne: https://verne.build/", and a pinned direction beats the roll.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

Contact e-mail (env var, empty). Public download (no signed build). Stripe (buttons without action).
