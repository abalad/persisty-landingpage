"use client";

import { Bell, BellOff, ChevronDown, EyeOff, KeyRound, Lock, MessageCircleQuestion, ShoppingBag, SquareKanban } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { readStudioEnv, wantsLive3d } from "@/components/home/studioMode";
import { BoardStill } from "@/components/mockups/BoardMock";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "@/lib/pricing";
import type { CharacterRig } from "./character/rig";
import styles from "./stage.module.css";

/**
 * The story, in phases: asleep on the browser's edge; checkout asks, then the shipping agent; the balloon opens with
 * both; the catalogue's agent finishes; someone opened the two, and it sits down again. The phase's length in ms.
 */
const PHASES = [
  { key: "rest", ms: 4800 },
  { key: "ask", ms: 2600 },
  { key: "ask2", ms: 2600 },
  { key: "balloon", ms: 5600 },
  { key: "done", ms: 2600 },
  { key: "settle", ms: 2000 },
] as const;
type Phase = (typeof PHASES)[number]["key"];

/** Where the visitor's own clicks leave it: two sessions waiting, the balloon as they set it. */
const MANUAL: Phase = "ask2";

const waitingIn = (phase: Phase) => (phase === "ask" ? 1 : phase === "rest" || phase === "settle" ? 0 : 2);

/**
 * The mascot outside the app, on a desk: Persisty behind with its Board, a browser in front where you are working, and
 * the mascot on the browser's top edge. It plays its story while in view: asleep, then rising with a count and a line
 * when a session asks, its balloon listing who waits and for what, a little celebration when a turn ends. A click on it
 * opens or closes the balloon, and its buttons are real: the Board opens the section that shows it, the bell and the
 * eye do what they say. The picture of it asking shows first, and stays for reduced motion, Save-Data, small devices
 * and browsers without WebGL.
 */
export function MascotStage({ boardHref }: { boardHref: string }) {
  const t = useTranslations("mock.mascot");
  const locale = useLocale() as Locale;
  const ids = { balloon: useId(), title: useId(), needs: useId() };
  const desk = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const rig = useRef<CharacterRig | null>(null);
  const [live, setLive] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [phase, setPhase] = useState<Phase>(MANUAL);
  const [manual, setManual] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [dnd, setDnd] = useState(false);
  const [hidden, setHidden] = useState(false);
  /** Sat down on the edge a moment ago, it closes its eyes: asleep until someone asks. */
  const [dozing, setDozing] = useState(false);

  // ---- the live 3D: loaded once the desk is in view, after the page has loaded; asleep off screen.
  useEffect(() => {
    const host = desk.current;
    const el = canvas.current;
    if (!host || !el || !wantsLive3d(readStudioEnv())) return;
    let gone = false;
    let requested = false;
    let resizer: ResizeObserver | null = null;
    const size = () => rig.current?.resize(el.clientWidth || 200, el.clientHeight || 200, window.devicePixelRatio || 1);
    const start = async () => {
      const { createCharacterRig } = await import("./character/rig");
      if (gone) return;
      const r = createCharacterRig(el, { reduced: false, rest: "stand", fpsRest: 12 });
      if (!r) return;
      rig.current = r;
      r.setRest("sit");
      size();
      resizer = typeof ResizeObserver === "function" ? new ResizeObserver(size) : null;
      resizer?.observe(el);
      requestAnimationFrame(() => {
        if (gone) return;
        setLive(true);
        setPhase("rest");
      });
    };
    const viewer = new IntersectionObserver(([entry]) => {
      const seen = Boolean(entry?.isIntersecting);
      setOnScreen(seen);
      if (!seen || requested) return;
      requested = true;
      const idle = () => {
        if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => void start(), { timeout: 1500 });
        else setTimeout(() => void start(), 200);
      };
      if (document.readyState === "complete") idle();
      else window.addEventListener("load", idle, { once: true });
    });
    viewer.observe(host);

    // The eyes follow the pointer, at most once a frame.
    let pending = 0;
    const onMove = (e: MouseEvent) => {
      if (pending || !rig.current) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        const r = el.getBoundingClientRect();
        if (!r.width) return;
        const x = (e.clientX - (r.left + r.width / 2)) / 420;
        const y = (e.clientY - (r.top + r.height * 0.4)) / 320;
        rig.current?.look(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)));
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      gone = true;
      viewer.disconnect();
      resizer?.disconnect();
      window.removeEventListener("mousemove", onMove);
      if (pending) cancelAnimationFrame(pending);
      rig.current?.dispose();
      rig.current = null;
    };
  }, []);

  // ---- the story moves on while live, in view and nobody took over.
  useEffect(() => {
    if (!live || !onScreen || manual) return;
    const at = PHASES.findIndex((p) => p.key === phase);
    const id = window.setTimeout(() => {
      setDozing(false);
      setPhase(PHASES[(at + 1) % PHASES.length].key);
    }, PHASES[at].ms);
    return () => window.clearTimeout(id);
  }, [live, onScreen, manual, phase]);

  // It sits first; the eyes close once it has settled on the edge (the app waits longer before it sleeps).
  useEffect(() => {
    if (!live || !onScreen || manual || phase !== "rest") return;
    const id = window.setTimeout(() => setDozing(true), 1900);
    return () => window.clearTimeout(id);
  }, [live, onScreen, manual, phase]);

  // ---- what the character does in each phase.
  useEffect(() => {
    const r = rig.current;
    if (!r || !live) return;
    r.sleep(!onScreen);
    if (!onScreen) return;
    const waiting = waitingIn(phase) > 0 && !dnd;
    r.setBadge(waitingIn(phase) > 0);
    if (phase === "rest") {
      r.setMood("idle");
      r.setRest("sit");
      if (dozing) r.sleep(true);
    } else if (phase === "ask") {
      r.leaveRest(true);
      r.setMood("asking");
    } else if (phase === "ask2") {
      r.setMood(waiting ? "asking" : "idle");
      if (!manual) r.react({ kind: "wave" });
    } else if (phase === "balloon") {
      r.poke();
    } else if (phase === "done") {
      r.setMood("idle");
      r.react({ kind: "celebrate" });
    } else {
      r.setMood("idle");
      r.setRest("sit");
    }
  }, [phase, live, onScreen, manual, dnd, dozing]);

  // The balloon follows the story until the visitor takes over.
  const open = manual ? manualOpen : phase === "balloon";
  const waiting = waitingIn(phase);
  const speech =
    dnd || open || hidden
      ? null
      : phase === "ask"
        ? { tone: "warn", kind: "permission", text: t("speech.permission", { title: "checkout" }) }
        : phase === "ask2" && !manual
          ? { tone: "warn", kind: "question", text: t("speech.question", { title: t("shipping") }) }
          : phase === "done"
            ? { tone: undefined, kind: "done", text: t("speech.done", { title: t("catalog") }) }
            : null;
  const asleep = live && phase === "rest" && dozing && !hidden;

  const toggle = () => {
    setDozing(false);
    setManualOpen(!open);
    setManual(true);
    if (phase === "rest" || phase === "settle" || phase === "done") {
      setPhase(MANUAL);
      rig.current?.leaveRest(false);
    }
    rig.current?.poke();
  };
  const hide = () => {
    setManual(true);
    setManualOpen(false);
    setHidden(true);
  };
  const bringBack = () => {
    setHidden(false);
    setPhase(MANUAL);
  };

  return (
    <figure className={styles.stage} aria-label={t("label")}>
      <div ref={desk} className={styles.desk}>
        <div className={styles.behind} aria-hidden="true">
          <BoardStill />
        </div>

        <div className={styles.browser} aria-hidden="true">
          <div className={styles.chrome}>
            <span className={styles.lights}>
              <span />
              <span />
              <span />
            </span>
            <span className={styles.address}>
              <Lock />
              localhost:3000/{t("path")}
            </span>
          </div>
          <div className={styles.page}>
            <div className={styles.shopHead}>
              <span className={styles.shopName}>Quintal</span>
              <span className={styles.shopNav}>
                {(t.raw("nav") as string[]).map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </span>
              <ShoppingBag className={styles.cart} />
            </div>
            <div className={styles.titleRow}>
              <div className={styles.shopTitle}>{t("shopTitle")}</div>
              <span className={styles.count}>{t("count")}</span>
            </div>
            <div className={styles.filters}>
              {(t.raw("filters") as string[]).map((f, i) => (
                <span key={f} className={i === 0 ? styles.filterOn : undefined}>
                  {f}
                  <ChevronDown />
                </span>
              ))}
            </div>
            <ul className={styles.products}>
              {PRODUCTS.map((p, i) => (
                <li key={p.key} className={styles.product}>
                  <span className={styles.productText}>
                    <span className={styles.productName}>{(t.raw("plants") as string[])[i]}</span>
                    <span className={styles.productCare}>{(t.raw("care") as string[])[i]}</span>
                  </span>
                  <span className={styles.price}>{formatPrice(locale, p.cents, locale === "pt-BR" ? "BRL" : "USD")}</span>
                  <span className={styles.add}>{t("add")}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.box} data-live={live} data-hidden={hidden}>
          {/* eslint-disable-next-line @next/next/no-img-element -- the mascot asking, drawn at its own size */}
          <img className={styles.still} src="/art/mascot-asking.webp" alt="" width={200} height={200} draggable={false} />
          <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
          {waiting > 0 && !hidden ? (
            <span key={waiting} className={styles.badge} aria-hidden="true">
              {waiting}
            </span>
          ) : null}
          {asleep ? (
            <span className={styles.zzz} aria-hidden="true">
              <span>z</span>
              <span>z</span>
              <span>z</span>
            </span>
          ) : null}
          {speech ? (
            // What it says opens the session; here, the section that shows the Board.
            <a key={speech.text} href={boardHref} className={styles.speech} data-tone={speech.tone}>
              {speech.kind === "permission" ? <KeyRound aria-hidden="true" /> : speech.kind === "question" ? <MessageCircleQuestion aria-hidden="true" /> : null}
              {speech.text}
            </a>
          ) : null}
          <button type="button" className={styles.hit} aria-expanded={open} aria-controls={ids.balloon} aria-label={t("button", { count: waiting })} onClick={toggle} />
        </div>

        {hidden ? (
          <button type="button" className={styles.bringBack} onClick={bringBack}>
            {t("show")}
          </button>
        ) : null}

        {open && !hidden ? (
          <section id={ids.balloon} className={styles.balloon} aria-labelledby={ids.title}>
            <header className={styles.balloonHead}>
              <h3 id={ids.title} className={styles.balloonTitle}>
                Persisty
              </h3>
              <a className={styles.ghost} href={boardHref}>
                <SquareKanban aria-hidden="true" />
                {t("openBoard")}
              </a>
              <button type="button" className={styles.icon} aria-pressed={dnd} aria-label={t("dnd")} title={t(dnd ? "dndOff" : "dnd")} onClick={() => setDnd((d) => !d)}>
                {dnd ? <BellOff aria-hidden="true" /> : <Bell aria-hidden="true" />}
              </button>
              <button type="button" className={styles.icon} aria-label={t("hide")} title={t("hide")} onClick={hide}>
                <EyeOff aria-hidden="true" />
              </button>
            </header>
            <div className={styles.balloonBody}>
              {waiting > 0 ? (
                <section aria-labelledby={ids.needs}>
                  <h4 id={ids.needs} className={`${styles.label} ${styles.labelWarn}`}>
                    {t("needsYou")}
                  </h4>
                  <ul className={styles.list}>
                    <li className={styles.item}>
                      <span className={styles.itemText}>
                        <span className={styles.itemLine}>
                          <span className={styles.itemName}>checkout</span>
                          <span className={styles.itemProject}>Rota</span>
                        </span>
                        <span className={styles.itemWhat}>
                          <KeyRound aria-hidden="true" /> Bash <span className={styles.code}>pnpm test:e2e checkout.spec.ts</span>
                        </span>
                        <span className={styles.since}>{t("waiting", { minutes: 14 })}</span>
                      </span>
                      <a className={styles.openBtn} href={boardHref}>
                        {t("open")}
                      </a>
                    </li>
                    {waiting > 1 ? (
                      <li className={styles.item}>
                        <span className={styles.itemText}>
                          <span className={styles.itemLine}>
                            <span className={styles.itemName}>{t("shipping")}</span>
                            <span className={styles.itemProject}>Quintal</span>
                          </span>
                          <span className={styles.itemWhat}>{t("shippingAsks")}</span>
                          <span className={styles.since}>{t("waiting", { minutes: 6 })}</span>
                        </span>
                        <a className={styles.openBtn} href={boardHref}>
                          {t("open")}
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </section>
              ) : (
                <p className={styles.label}>{t("empty")}</p>
              )}
              <h4 className={styles.label}>{t("notices")}</h4>
              <ul className={styles.list}>
                <li className={styles.item}>
                  <span className={styles.itemText}>
                    <span className={styles.itemName}>{t("catalog")}</span>
                    <span className={styles.itemWhat}>
                      <span className={styles.noticeKind}>{t("finished")}</span> · 10:42
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </section>
        ) : null}
      </div>
    </figure>
  );
}

const PRODUCTS = [
  { key: "pothos", cents: 3990 },
  { key: "monstera", cents: 7990 },
  { key: "zz", cents: 5490 },
  { key: "fern", cents: 2990 },
] as const;
