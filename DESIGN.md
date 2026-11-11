---
name: Persisty
description: The website for Persisty, a local-first desktop workspace that keeps AI coding sessions alive; dark only, built from the desktop app's own tokens.
colors:
  lime: "#c6f24e"
  lime-strong: "#ddf98f"
  lime-wash: "rgba(198, 242, 78, 0.12)"
  focus-mint: "#ddf98f"
  page-ground: "#0a0c10"
  page-ground-raised: "#0d1015"
  selected-raised: "#11151c"
  page-hairline: "#1b1f28"
  heading-white: "#f2f4f8"
  body-grey: "#b8bfcc"
  muted-grey: "#8b94a7"
  pill-paper: "#c6f24e"
  pill-paper-hover: "#ffffff"
  pill-graphite: "#171a22"
  pill-graphite-hover: "#1e222c"
  pill-graphite-border: "#2a303d"
  window-ground: "#0f1115"
  app-surface: "#151821"
  app-surface-2: "#11141b"
  app-surface-3: "#1b1f2a"
  app-border: "#262b37"
  app-border-strong: "#343a49"
  app-fg: "#d8dde6"
  app-fg-muted: "#98a1b3"
  app-fg-subtle: "#7c859a"
  status-warn: "#e3b24a"
  status-warn-wash: "rgba(227, 178, 74, 0.14)"
  status-ok-wash: "rgba(198, 242, 78, 0.14)"
  status-info: "#7aa7e8"
  status-danger: "#ef7d7d"
  status-danger-wash: "rgba(239, 125, 125, 0.14)"
  status-neutral: "#8d96a8"
  status-neutral-wash: "rgba(141, 150, 168, 0.14)"
typography:
  display:
    fontFamily: "Mona Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 1.05rem + 3.4vw, 3.625rem)"
    fontWeight: 330
    lineHeight: 1.04
    letterSpacing: "-0.03em"
    fontVariation: "\"wdth\" 106"
  display-closing:
    fontFamily: "Mona Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.375rem, 1.15rem + 4.3vw, 4.25rem)"
    fontWeight: 330
    lineHeight: 1.04
    letterSpacing: "-0.03em"
    fontVariation: "\"wdth\" 106"
  page-title:
    fontFamily: "Mona Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 1.2rem + 3vw, 3.5rem)"
    fontWeight: 330
    lineHeight: 1.05
    letterSpacing: "-0.03em"
    fontVariation: "\"wdth\" 106"
  headline:
    fontFamily: "Mona Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 1.25rem + 2.3vw, 3rem)"
    fontWeight: 340
    lineHeight: 1.08
    letterSpacing: "-0.022em"
    fontVariation: "\"wdth\" 104"
  subhead:
    fontFamily: "Mona Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.05rem + 0.8vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.25
  title:
    fontFamily: "Mona Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 500
    lineHeight: 1.4
  price:
    fontFamily: "Mona Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 380
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
    fontVariation: "\"wdth\" 104"
  lead:
    fontFamily: "Mona Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 0.98rem + 0.4vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Mona Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    fontVariation: "\"wdth\" 100"
  prose:
    fontFamily: "Mona Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Mona Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1
  fine:
    fontFamily: "Mona Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono, SF Mono, Menlo, Consolas, ui-monospace, monospace"
    fontSize: "0.9em"
    fontWeight: 400
rounded:
  app-sm: "4px"
  app-md: "6px"
  xs: "5px"
  sm: "7px"
  md: "10px"
  lg: "12px"
  xl: "14px"
  icon: "18px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  section-y: "clamp(80px, 11vw, 152px)"
  nav-height: "64px"
  page: "1200px"
  head-gap: "64px"
  row: "22px"
components:
  button-primary:
    backgroundColor: "{colors.pill-paper}"
    textColor: "{colors.page-ground}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "46px"
    padding: "0 22px"
  button-primary-hover:
    backgroundColor: "{colors.pill-paper-hover}"
  button-secondary:
    backgroundColor: "{colors.pill-graphite}"
    textColor: "{colors.heading-white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "46px"
    padding: "0 22px"
  button-secondary-hover:
    backgroundColor: "{colors.pill-graphite-hover}"
  button-ghost:
    textColor: "{colors.body-grey}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "36px"
    padding: "0 16px"
  button-md:
    rounded: "{rounded.pill}"
    height: "36px"
    padding: "0 16px"
  nav-link:
    textColor: "{colors.body-grey}"
    rounded: "{rounded.pill}"
    height: "34px"
    padding: "0 12px"
  badge-available:
    backgroundColor: "{colors.status-ok-wash}"
    textColor: "{colors.lime}"
    rounded: "{rounded.pill}"
    height: "22px"
    padding: "0 8px"
  badge-in-development:
    backgroundColor: "{colors.status-warn-wash}"
    textColor: "{colors.status-warn}"
    rounded: "{rounded.pill}"
    height: "22px"
    padding: "0 8px"
  badge-preview:
    backgroundColor: "{colors.status-warn-wash}"
    textColor: "{colors.status-warn}"
    rounded: "{rounded.pill}"
    height: "22px"
    padding: "0 8px"
  badge-planned:
    backgroundColor: "{colors.status-neutral-wash}"
    textColor: "#a9b1c1"
    rounded: "{rounded.pill}"
    height: "22px"
    padding: "0 8px"
  badge-pro:
    textColor: "{colors.lime}"
    rounded: "{rounded.pill}"
    height: "22px"
    padding: "0 8px"
  tab-pill:
    textColor: "{colors.muted-grey}"
    rounded: "{rounded.pill}"
    height: "36px"
    padding: "0 14px"
  tab-pill-selected:
    backgroundColor: "{colors.lime-wash}"
    textColor: "{colors.heading-white}"
  input:
    backgroundColor: "{colors.page-ground-raised}"
    textColor: "{colors.heading-white}"
    rounded: "{rounded.md}"
    height: "46px"
    padding: "0 14px"
  seamed-panel:
    backgroundColor: "{colors.page-ground-raised}"
    rounded: "{rounded.xl}"
    padding: "28px 24px"
  seamed-panel-featured:
    backgroundColor: "{colors.selected-raised}"
  app-window:
    backgroundColor: "{colors.window-ground}"
    textColor: "{colors.app-fg}"
    rounded: "{rounded.lg}"
  popover:
    backgroundColor: "{colors.app-surface}"
    textColor: "{colors.app-fg}"
    rounded: "{rounded.md}"
    padding: "6px"
---

# Design System: Persisty

## Overview

**Creative North Star: "The App on the Desk"**

The site is the desktop app's own graphite world with the lights lowered one step. Every claim is carried by a faithful HTML rendition of the Persisty window, and the page exists to set that window down as an object: a darker ground, a soft shadow under it, nothing competing with it. The page around the windows is quiet typographic structure: a centred statement, light display type, two-column section heads, hairline-divided lists.

Density lives inside the mockups, where the app's real vocabulary runs at app scale (13px text, 26px tabs, status chips). Outside them the site is spacious and calm: long section rhythm, muted body copy, one lime reserved for what is alive or actionable. The world refuses the category default of gradient hero, icon-card feature grid and logo wall; the build answers each with the product itself, hairline lists and honest availability badges.

The site is dark only. There is no light theme, and the root declares `color-scheme: dark`.

**Key Characteristics:**
- App tokens copied from the desktop app (dark theme); site-only tokens layered on top.
- Page ground one step darker than the app window, so windows read as objects.
- One accent, lime, for alive and action; primary CTA is a lime pill with dark text.
- Mona Sans light at display sizes, widened through its `wdth` axis; JetBrains Mono only where machines speak.
- Structure by 1px hairlines; shadow only on things that float.
- Mockups sized in app pixels (`--u`) so they scale like screenshots while staying real, translatable text.

## Colors

Cool graphite neutrals in two tiers (page and app window), one lime accent, and the app's four status hues, each always paired with an icon and a word.

### Primary
- **Lime** (lime): the only accent. Text links and arrow links under section heads, the first-viewport crash link, checkmarks in plan features and the comparison table, the Pro badge outline, the selected tab-pill border, the featured plan's top marker, input focus border, caret, and the app's "alive" states inside mockups.
- **Bright Lime** (lime-strong): the app's emphasised accent, used inside mockups.
- **Lime Wash** (lime-wash): the fill behind selected tab pills and accent notices; selection uses the same hue at 28%.
- **Focus Mint** (focus-mint): the 2px focus outline on every focusable element, offset 3px.

### Neutral
- **Night Ground** (page-ground): the page itself, the sticky nav bar, the primary pill's text.
- **Raised Night** (page-ground-raised): grouped panels on the page (plan grid, comparison header, platform list, account boxes, inline code, inputs).
- **Selected Night** (selected-raised): the featured plan column and the visitor's own platform row; a raised panel one step lighter.
- **Night Hairline** (page-hairline): every structural line on the page: nav bottom, section rules, seams between grouped items, FAQ rows, footer.
- **Heading White** (heading-white): headings, active nav, button text on graphite.
- **Body Grey** (body-grey): running text and nav links at rest.
- **Muted Grey** (muted-grey): section body, leads, captions, footer links, fine print (6.4:1 on the ground).
- **Paper Pill** / **Paper Pill Hover** (pill-paper, pill-paper-hover): the primary pill fill; brightens to pure white on hover.
- **Graphite Pill** / hover / border (pill-graphite, pill-graphite-hover, pill-graphite-border): the secondary pill; the border tone doubles as the input stroke.
- **App graphite** (window-ground, app-surface, app-surface-2, app-surface-3, app-border, app-border-strong, app-fg, app-fg-muted, app-fg-subtle): the desktop app's palette, used inside mockups and for floating app-like chrome on the page (locale popover, code blocks, `kbd`).

### Status
- **Amber** (status-warn): waiting for you, permission pending, "Preview", "In development", usage bars at 90% or more.
- **Blue** (status-info): working.
- **Lime** (lime, same token as the accent): idle, OK, "Available".
- **Coral** (status-danger): errors and invalid fields, and the text and edge of the pill that ends a subscription.
- **Slate** (status-neutral): "Planned" and neutral app states.
- Each has a 14% wash for chip and badge fills.

### Named Rules
**The Window-as-Object Rule.** The page ground stays one step darker than the app window ground. Never render a mockup on a ground equal to or darker than its own; the step is what makes it read as an object on a desk.

**The One Lime Rule.** Lime marks what is alive or actionable and nothing else: the orbit dot, the primary button, links and alive states. It never fills a section background or a decorative shape, and text on lime is always dark.

**The Word-and-Icon Status Rule.** A status hue never appears alone: every state carries its Lucide icon and its word (badges carry a dot and a label; "Planned" uses a hollow dot).

## Typography

**Display Font:** Mona Sans (variable width and weight), with -apple-system, Segoe UI, system-ui
**Body Font:** Mona Sans
**Label/Mono Font:** JetBrains Mono, with SF Mono, Menlo, Consolas

**Character:** One variable family does everything: light and slightly widened at display sizes so headlines feel open and calm, regular and normal width in running text, medium for labels. Mono appears only where a machine is speaking.

### Hierarchy
- **Display** (330, `wdth` 106, tracking -0.03em): the hero headline, left-aligned beside the studio, about four balanced lines, max 13em wide (15em in one column).
- **Display Closing** (same voice, one step larger): the closing statement only.
- **Page Title** (330, `wdth` 106): headers of Pricing, Download, Docs index, Security and similar routes. Docs articles, account and sign-in use the same weight and axis at smaller clamps.
- **Headline** (340, `wdth` 104, max 22ch): the left column of every two-column section head.
- **Subhead** (400): secondary headings on Pricing and Download.
- **Title** (500): item names in hairline lists, agent strip, FAQ questions (450), plan names (1.25rem, `wdth` 106).
- **Price** (380, tabular figures, `wdth` 104): plan amounts.
- **Lead** (400, muted, 46 to 58ch): the sentence beside or under a headline.
- **Body** (400): default text. **Prose** (1.0625rem / 1.7, max 70ch): docs, changelog, legal; prose h2 at 1.625rem weight 420.
- **Label** (500): pill buttons (0.875rem at 36px, 0.96875rem at 46px), nav (0.9375rem), footer column heads.
- **Fine** (400): notes under CTAs, plan footnotes, legal fine print.
- **Mono** (JetBrains Mono, ligatures off in mockups): terminals, code blocks, inline code, `kbd`, branch names, the e-mail code field.

### Named Rules
**The Light Display Rule.** Headings sit between weight 330 and 420 with `wdth` 104 to 106 and negative tracking; weight 500 and above is for labels and short titles, never for display.

**The Machines-Speak-Mono Rule.** JetBrains Mono appears only in terminals, code and data. Marketing copy, headings and buttons are always Mona Sans.

## Layout

A single centred column, 1200px of content plus a fluid gutter (16px to 40px). Sections are separated by a fluid vertical rhythm (80px to 152px); a hairline rule can open a section. The nav is sticky at 64px and anchors scroll with a 24px allowance.

The home page follows one pattern repeated: a two-column section head (headline left, up to 22ch so most hold two lines; a lead of two or three lines, badges and an arrow link right; 64px column gap) over a full-width app window, or a narrower 960px window for smaller mockups. The hero is two columns (one below 1024px): headline (capped so it holds three lines on desktop), a two-line lead and two pills on the left, then a muted link with an accent arrow down to the crash demo and two short facts with icons side by side over a hairline (stacked when the column is too narrow for both); on the right the desktop app's clay studio in 3D (three.js, loaded after the page, asleep off screen), bleeding a little past the page edge, with four live cards pinned to its stations by dashed leaders. Phones run the live scene too (its canvas has a third of a desktop's pixels); reduced motion, Save-Data, devices under 4 GB and browsers without WebGL get the still picture of the same frame with the cards. The app window follows, starting above the fold, with the desktop app's mascot in its terminal's bottom-right corner, as in the app: peeking (just the head), it types along while the agent works, pops up with both arms raised when the turn ends, follows the pointer and hops when clicked (live 3D loaded once in view and asleep off screen; reduced motion, Save-Data, devices under 4 GB and browsers without WebGL get the picture of it peeking) (under 680px it is not shrunk to a terminal: drawn at desktop size inside a 4:3 view, a camera tours it in five chapters, overview, the agent working, waiting for you, workspaces and usage limits, playing on its own while on screen, a tap on a segment jumping there; reduced motion keeps it still and cuts between chapters), with the agent strip right under it as its caption: Claude Code, Codex and any CLI, each glyph in a small raised tile, columns divided by vertical hairlines only; its title "Works with what you already use" is kept for screen readers alone (the user, 2026-10-23: remove the phrase, work the part under it).

Grouped content is a list divided by hairlines, never a grid of separate cards: the agent strip (three columns), company items (two columns, 64px gap), FAQ, plan grid (four columns), platform list. Rows pad 22px vertically.

Responsive steps: under 680px the projects, agents and editor windows are toured like the hero's (four, three and four chapters, captions under them), since their narrow layouts dropped the sidebar, the agents list and the file tree; accounts, network, Pro and the crash demo keep their narrow layouts, which already read on a phone; section heads stack under 820px; the nav collapses to a menu under 1000px (five links, the longest "Funcionalidades"); plans go to two columns under 1080px and one under 640px; the agent strip stacks under 760px; docs drops its table of contents under 1100px and its sidebar under 820px.

Mockups respond to their container, not the viewport: each window is an inline-size container, every dimension is `calc(n * var(--u))` against a design width (1120 by default, 860 for narrow windows), clamped between 0.6px and 1px per app pixel. Under 640px of container width the window switches to a 400-unit narrow layout that hides the rail and side panels.

## Elevation & Depth

Flat by default, structured by hairlines and the two-step ground (page, raised panel). Shadow is reserved for things that physically float above the page: the app window, the studio's pinned cards and the locale popover. Inset lines carry state instead of elevation.

### Shadow Vocabulary
- **Window** (`box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 60px -12px rgba(0,0,0,0.7), 0 8px 20px -8px rgba(0,0,0,0.5)`): every app window mockup.
- **Popover** (`box-shadow: 0 8px 24px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.04) inset`): menus such as the locale switcher.
- **Studio cards** (`--shadow-popover`): the cards pinned to the hero studio.
- **Focus halo** (`box-shadow: 0 0 0 3px rgba(198,242,78,0.18)`): text inputs on focus, with a lime border.
- **Featured marker** (`box-shadow: inset 0 2px 0` lime): the top edge of the featured plan column.

### Named Rules
**The Hairline-Not-Shadow Rule.** On the page, separation is a 1px hairline or a one-step ground change. A shadow means the thing floats; panels, cards and lists never get one.

## Shapes

Pills for everything you press on the page (buttons, nav links, tab pills, badges, the locale trigger). Containers use gentle, slightly generous corners that grow with size: 5px for inline code and `kbd`, 7px for docs nav items and the logo, 10px for inputs, notices, code blocks and popovers, 12px for the app window and account boxes, 14px for page-level grouped panels and the hero studio's cards. Inside mockups the app's own 4px and 6px radii apply, scaled by `--u`. Borders are always 1px; the only dashed stroke is the app's "new tab" button.

## Components

### Buttons
Soft, quiet pills; the lime one is the only bright object on a dark page.
- **Shape:** full pill (999px).
- **Primary:** paper fill, night text, weight 500; 46px tall with 22px sides (large) or 36px with 16px (medium). Lucide icon at 1.05em with a 0.5em gap.
- **Hover / Active:** fill brightens to white over 180ms; press nudges down 1px. Disabled at 55% opacity.
- **Secondary:** graphite fill with a graphite border and heading-white text; hover lifts fill and border one step.
- **Ghost:** transparent, body-grey text; hover adds a 4% white wash and heading-white text (nav sign-in).
- **Arrow link:** lime text, weight 500, trailing arrow that slides 3px on hover.
- **Danger:** the graphite pill with coral text and a coral edge at 32%; hover fills it with the coral wash. Only for the button that ends something: "Cancel subscription" beside "Manage subscription" on the right of a plan in My account, and the last button of the cancelling dialog.

### Badges
- **Style:** 22px pill, 0.75rem weight 500, a 6px dot plus a word. Available (lime on its wash), Preview (amber on its wash, hollow dot: a download that is out but unsigned and not tested on real machines), In development (amber on its wash), Planned (slate wash, hollow dot), Pro (transparent with a 1px lime inset ring at 45%).

### Tab pills
- **Style:** 36px pill with a hairline border, muted text and a 15px icon; hover brightens text and border. Selected: lime wash with a 50% lime border and white text. Scrolls horizontally, edge to edge, on narrow screens.

### Seamed panels
Grouped items share one container split by hairlines instead of separate cards.
- **Corner Style:** 14px (12px for account boxes).
- **Background:** raised night; the featured or "yours" item uses selected night.
- **Shadow Strategy:** none (see Elevation).
- **Border:** 1px night hairline, outer and between items.
- **Internal Padding:** 28px by 24px for plans, 24px for platform rows, 18px by 20px for account rows.

### Inputs / Fields
- **Style:** 46px tall, 10px radius, raised-night fill, graphite-pill border, 1rem heading-white text.
- **Focus:** lime border plus a 3px lime halo at 18%; no outline.
- **Error:** coral border; error notices are a coral wash panel with a Lucide icon.
- **Code field:** JetBrains Mono, 1.375rem, tracked 0.3em, centred.

### Navigation
- **Style:** sticky 64px bar on the night ground with a hairline bottom. Logo and wordmark (weight 560, `wdth` 108) left; centred pill links (34px, body grey, hover 4% wash, current page heading-white), "Features" among them as the trigger of the features menu; locale switcher, ghost sign-in and a medium primary download pill right. Under 1000px the links fold into a menu.

### FAQ
- **Style:** native disclosure rows between hairlines, 22px vertical padding, question in heading white at 1.0625rem; a drawn plus mark rotates 45 degrees to close. Answer muted, max 68ch.

### App Window (signature)
The desktop app redrawn in HTML at full fidelity: macOS traffic lights, top bar with project name and session tabs, project rail (six made-up projects, each with its own logo filling its tile the way an uploaded logo does in the app: Rota, Quintal, Bússola, Maré, Pulso, Vela, invented names and marks, none a real company's; the list is cut at the window's bottom as it scrolls in the app, never stretching the window), terminal in JetBrains Mono, status chips, and a status bar with live 5h and 7d usage bars. Window-ground fill, 1px border, 12-unit radius, window shadow. All sizes in `--u`; it carries `role="img"` with a translated label. Animated states (agents changing state, the crash and recovery sequence, rows returning one by one at 360ms) switch instantly under reduced motion.

### The Board (in the App Window)
The app's Board, drawn from its own `board.css`, is the window of "You know which agent needs you" on the home page and on `/free`. It has the top bar with the Board toggle pressed, the rail, and a header: the title, an All/This project pill, and three chips (the needs-you chip in amber with the oldest wait, working in blue with its spinner, unread in slate), with "Back to the terminal" on the right.
- **Columns:** four columns that are not boxes, each a dot, a name and a count over a hairline, then the cards on the window ground.
- **Cards:** three steps of weight: the name and how long ago; what it wants (a tool and its command in mono, a question in two lines, an error in coral with its icon); where it lives.
- **Focal card:** the oldest wait is the only amber frame, with "A opens this one".
- **Unread:** a lime dot and a bolder name.
- **Motion:** while in view, the catalogue's card glides from Working to Answered and back (FLIP against the board, so page scroll never moves it). The counts roll. Reduced motion holds the answered state.
- **Phones:** it is toured in four chapters (overview, Needs you, the card changing column, the summary).

### The mascot desk
The mascot outside the app lives on `/free` in a narrow section, on a desk drawn as your screen.
- **The desk:** the page's own ground, flat, with a hairline edge and a 14-unit corner.
- **Windows:** two, off its edges. Persisty is behind, its Board drawn smaller at `brightness(0.93)` so it stays a step above the ground. A browser is in front, on `localhost:3000`.
- **The browser page:** Quintal, a made-up plant shop, typographic only (heading, filter pills, a hairline list of name, care, price and Add). Its paper and green ink are another app's palette on purpose; they are the only colours outside these tokens.
- **The mascot:** the app's own 3D character (copied into `src/components/mascot/`) in its 200-unit box, feet on the browser's top edge. On a phone the box scales to 0.68 so it keeps its share of the window.
- **The story:** asleep on the edge (sat, "zzz") → it rises with the amber count badge and a line ("checkout asks for permission", with the tool's icon) → the balloon (the app's) opens over the page → "catalog finished" with a celebration → it sits down again.
- **Clicks and links:** a click on the mascot takes over and toggles the balloon. What it says, the balloon's Open and Open the Board are links to `#states`. The bell is Do not disturb, and the eye hides it, with a pill to bring it back.
- **The still:** `public/art/mascot-asking.webp`, read from the live canvas, shows first and stays for reduced motion, Save-Data, small devices and no WebGL.

### Features menu (nav)
"Features" in the nav opens a panel hanging 8px under the sticky bar, centred on the page column, on raised night with the popover shadow (it floats) and a 14px corner. Three columns: the plans (Free, Pro, Team) as a vertical tablist, the chosen one on selected night with heading-white text and no side bar; the chosen plan's features in two columns (Lucide icon, name in heading white, one muted line, the Planned badge when it applies) under the plan's name and a lime "Everything in <plan>" arrow link; one feature shown on the right as a glimpse with its title and a line. Hover or arrows switch the plan, Esc closes and gives focus back, a click outside or a route change closes it. Under 1000px it becomes a "Features" group in the mobile menu, one disclosure per plan.

### Plan pages
`/free`, `/pro` and `/team` open with a two-column head: a page-title statement, a lead, the plan's large action and "Compare plans" on the left; the price on the featured plan's raised panel with its lime top edge on the right. A row of tab-pill links to the page's sections sits under a hairline. Then one section per feature in the home page's pattern (two-column head over the app window), each with the plan's badge and a two-cell strip under the window saying what the plan below gets and what this plan gets. Lists of the rest ("Also in", "Coming to") are hairline rows in two columns, each with an icon, a name and a line; planned rows carry the Planned badge. The comparison (with this plan's column on selected night and a lime top edge in its header), the plan's questions and a centred closing follow. Team's sections carry a "Team" badge styled like Pro's.

### The bar for people the app sent
`/pro?tried=<anchor>` shows a fixed bar under the nav, on raised night with the popover shadow: what the person tried to use, a line for people who already pay (where to sign in), the price and Subscribe. Anchors scroll below it (`--tried-bar` adds its height to the page's scroll padding). Unknown values show nothing.

### Glimpses
A glimpse is a cut of the app's interface at 1:1 (the mockup parts with `--u: 1px`): 13px text, chips, meters, list items, on the window ground with an app border and an 8px corner, about 112px tall. Used in the features menu and in My account, decorative to screen readers because the feature's name and line sit beside it as text. Never an illustration or an icon tile.

### My account
A panel: a 220px menu beside the part shown (overview, plan and billing, team only for people with a team, devices with "n of 5", release e-mails), the current item on selected night with a lime icon; under 900px the menu becomes a row of pill tabs that scrolls sideways. Each part has an h2 title, never an uppercase label. The overview opens with the plan on the featured raised panel (name at page-title weight, the state with a dot and a word, the price), then what the plan unlocks as one hairline-divided panel of rows (glimpse, name, line, where it lives in the app, "How to use it"), what is coming, and the one plan up: Free sees Pro's features as what it would get with Subscribe beside them; Pro sees Team in a quiet raised panel.

### Cancelling dialog
A native modal dialog, 840px wide, on raised night with the window's shadow and an 18px corner, one height for every step (488px) and nothing to scroll on a desktop: each step is cut to fill it (a title, one panel, at most a short list), never a paragraph. The mascot stands in full body and in 3D in its own 280px column on selected night, under a bubble (graphite pill fill and border, 14px corner, heading-white text, a tail pointing at the antenna) with one line of its own per step; the bubble pops in from its tail. On phones the dialog is a sheet at the bottom, as tall as its step, and the mascot and its bubble share a 168px band, the tail pointing left. Moods per step: puzzled (reason: a head tilt, one eye wider, a small mouth to one side and a hand scratching the head; wondering, never sad), hopeful (25%), pleading (30 days), goodbye (confirm), celebrate (stays), settled (cancelled: neither sad nor glad, a small calm smile and a slow nod, because the person did what they came to do). Staying is always the lime pill; going on is always a visible underlined text link; the button that ends the plan is the coral danger pill and ignores clicks for 450ms after its step appears. Each step moves the focus to its title. Reasons are radio rows in one hairline-divided panel in two columns (one under 520px), the selected one on the lime wash; the optional text is a two-line field with its label as placeholder. Offers sit on the featured panel with the lime top edge; the big figure (the price after the discount at 2.5rem, "30" at 4rem without tabular figures) is heading white, never lime; the free month lists what it means with lime checks. The confirmation is a hairline sheet of what holds until when (now on selected night) and two facts with icons. Copy never blames the person (`tests/copy.test.ts`).

## Do's and Don'ts

### Do:
- **Do** set every app mockup on the page ground (#0a0c10 family), one step darker than the window it shows.
- **Do** carry product claims with the app window itself, using the app's real vocabulary and Lucide icons.
- **Do** keep the primary action a lime pill with dark text and the secondary a graphite pill, side by side, 12px apart.
- **Do** pair every status colour with its icon and word, and label every capability Available, In development or Planned.
- **Do** size anything inside a mockup in app pixels (`calc(n * var(--u))`) and give it a narrow layout under 640px of container width.
- **Do** use 120ms for small state changes and 180ms with the `cubic-bezier(0.16, 1, 0.3, 1)` ease-out for colour and border transitions, and respect reduced motion everywhere.
- **Do** separate grouped items with 1px hairlines inside one shared panel.

### Don't:
- **Don't** add a light theme or light sections; the site is dark only.
- **Don't** fill backgrounds or decorative shapes with lime, or put light text on it.
- **Don't** use a gradient hero, an icon-card feature grid or a logo wall.
- **Don't** put shadows on page panels, cards or lists; shadow is only for the window, popovers and the studio's pinned cards.
- **Don't** set JetBrains Mono outside terminals, code and data, or set headings heavier than 420.
- **Don't** put small uppercase tracked labels above site headlines. Uppercase micro-labels belong to the app's own sidebar group labels inside mockups.
- **Don't** use emoji or text glyphs as icons; use Lucide.
