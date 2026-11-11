import { ChevronDown, FileCode2, Folder, GitCommitHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment } from "react";
import { Lights, ToolBar, cx } from "./parts";
import s from "./app.module.css";
import x from "./extra.module.css";

type Tok = [cls: keyof typeof x | "", text: string];

/** A real-looking file the agent just changed, highlighted by hand. */
const CODE: { toks: Tok[]; git?: "add" | "mod" }[] = [
  { toks: [["kw", "import"], ["", " { "], ["fn", "rateForZip"], ["", " } "], ["kw", "from"], ["str", ' "./table"'], ["", ";"]] },
  { toks: [] },
  { toks: [["kw", "export"], ["kw", " function"], ["fn", " quoteShipping"], ["", "(zip: "], ["ty", "string"], ["", ", weightKg: "], ["ty", "number"], ["", ") {"]], git: "mod" },
  { toks: [["kw", "  const"], ["", " rate = "], ["fn", "rateForZip"], ["", "(zip."], ["fn", "slice"], ["", "("], ["num", "0"], ["", ", "], ["num", "5"], ["", "));"]], git: "add" },
  { toks: [["kw", "  if"], ["", " (!rate) "], ["kw", "return"], ["", " { ok: "], ["kw", "false"], ["", ", reason: "], ["str", '"outside delivery area"'], ["", " };"]], git: "add" },
  { toks: [], git: "add" },
  { toks: [["cmt", "  // carriers charge by the started kilo"]], git: "add" },
  { toks: [["kw", "  const"], ["", " price = rate.base + rate.perKg * "], ["fn", "Math.ceil"], ["", "(weightKg);"]], git: "add" },
  { toks: [["kw", "  return"], ["", " { ok: "], ["kw", "true"], ["", ", price, days: rate.days };"]], git: "mod" },
  { toks: [["", "}"]] },
];

export function EditorMock() {
  const t = useTranslations("mock.editor");
  return (
    <>
      <div className={s.topbar}>
        <Lights />
        <span className={s.tabs}>
          <span className={cx(s.tab, s.tabActive)}>
            <FileCode2 /> quote.ts
          </span>
          <span className={cx(s.tab, s.hideNarrow)}>
            <FileCode2 /> table.ts
          </span>
        </span>
      </div>
      <div className={x.frameEditor} style={{ display: "flex" }}>
        <div className={x.tree}>
          <div className={x.treeRow}>
            <ChevronDown /> <Folder /> src
          </div>
          <div className={x.treeRow} style={{ paddingLeft: "calc(26 * var(--u))" }}>
            <ChevronDown /> <Folder /> shipping
          </div>
          <div className={cx(x.treeRow, x.treeOn)} style={{ paddingLeft: "calc(48 * var(--u))" }}>
            <FileCode2 /> quote.ts <span className={x.treeMark} style={{ color: "var(--color-info)" }}>M</span>
          </div>
          <div className={x.treeRow} style={{ paddingLeft: "calc(48 * var(--u))" }}>
            <FileCode2 /> table.ts <span className={x.treeMark} style={{ color: "var(--color-info)" }}>M</span>
          </div>
          <div className={x.treeRow} style={{ paddingLeft: "calc(48 * var(--u))" }}>
            <FileCode2 /> shipping.test.ts <span className={x.treeMark} style={{ color: "var(--color-ok)" }}>A</span>
          </div>
          <div className={x.treeRow} style={{ paddingLeft: "calc(26 * var(--u))" }}>
            <Folder /> checkout
          </div>
        </div>
        <div className={x.code}>
          {CODE.map((line, i) => (
            <div key={i} className={cx(x.codeLine, line.git === "add" && x.gitAdd, line.git === "mod" && x.gitMod)}>
              <span className={x.gutter}>{i + 1}</span>
              <span>
                {line.toks.map(([cls, text], j) => (
                  <Fragment key={j}>{cls ? <span className={x[cls]}>{text}</span> : text}</Fragment>
                ))}
              </span>
            </div>
          ))}
        </div>
        <div className={cx(x.sideFill, s.hideNarrow)} style={{ width: "calc(250 * var(--u))", flex: "none" }}>
          <div className={x.panelBody}>
            <span className={x.panelHeading}>{t("changes")}</span>
            <span className={cx(x.field)}>{t("message")}</span>
            <span className={x.btnRow}>
              <span className={x.btn}>
                <GitCommitHorizontal /> {t("commit")} ⌘↵
              </span>
            </span>
            <span className={x.label}>{t("staged")}</span>
            <span className={x.changeRow}>
              <b style={{ color: "var(--color-ok)" }}>A</b> shipping.test.ts
            </span>
            <span className={x.label}>{t("unstaged")}</span>
            <span className={x.changeRow}>
              <b style={{ color: "var(--color-info)" }}>M</b> quote.ts
            </span>
            <span className={x.changeRow}>
              <b style={{ color: "var(--color-info)" }}>M</b> table.ts
            </span>
          </div>
        </div>
        <ToolBar active="changes" changes={3} />
      </div>
    </>
  );
}
