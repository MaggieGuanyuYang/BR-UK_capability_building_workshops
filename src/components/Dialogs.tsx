import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  CITATION,
  PAPER_TITLE,
  PAPER_URL,
  TABLE_URL,
  strategies,
  strategyNumber,
} from "../data/strategies";
import { copyText, makeShareUrl } from "../lib/state";
import { Icon } from "./Icon";
import { StrategyTitle } from "./StrategyTitle";

function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  useEffect(() => {
    const dialog = ref.current!;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "modal-wide" : ""}`}
      aria-labelledby={headingId}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <div className="modal-header">
        <h2 id={headingId}>{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
          autoFocus
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function AboutDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="The research behind the actions"
    >
      <p className="modal-intro">
        What would help the UK conduct and use better behavioural research?
      </p>
      <p>
        Researchers from Behavioural Research UK (BR-UK) explored this question
        in five online workshops with 58 participants from academia, government,
        public and third sectors, and the private sector, in November–December
        2024.
      </p>
      <p>
        The study brought together{" "}
        <strong>10 participant-proposed strategies</strong>. This interactive
        visual reproduces the strategy titles and actions from Table 3 verbatim
        and preserves its links between strategies and actor groups. The map
        uses short labels for navigation.
      </p>
      <div className="research-note">
        <strong>A starting point for discussion</strong>
        <p>
          The strategies are not ranked and were not implemented or evaluated in
          this study. Their feasibility, cost and impact have not been
          established. They reflect a UK context and may need adaptation
          elsewhere.
        </p>
      </div>
      <p className="citation-title">{PAPER_TITLE}</p>
      <p className="citation-detail">
        Yang, Saunders, Hart, Davan Wetton, Coupe, Olson, Porter, Cox, Hart &
        Michie.
        <br />
        <em>PLOS One</em> 21(9): e0357909 · Published 10 September 2026.
      </p>
      <div className="modal-actions">
        <a
          className="primary-button"
          href={PAPER_URL}
          target="_blank"
          rel="noreferrer"
        >
          Read the paper
          <Icon name="external" />
        </a>
        <a
          className="text-button"
          href={TABLE_URL}
          target="_blank"
          rel="noreferrer"
        >
          Original strategy table
          <Icon name="external" size={17} />
        </a>
      </div>
      <div className="about-footer">
        <p>
          Adapted from Yang et al. (2026),{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noreferrer"
          >
            CC BY 4.0
          </a>
          . Funded by the ESRC (ES/Y001044/1).
        </p>
        <a
          className="text-button"
          href="./linkedin-post.png"
          download="research-into-action-linkedin.png"
        >
          <Icon name="download" size={16} />
          Download LinkedIn image
        </a>
      </div>
    </Modal>
  );
}

function planText(saved: number[]) {
  const items = strategies.filter((strategy) => saved.includes(strategy.id));
  return [
    "MY NEXT STEPS FOR STRONGER BEHAVIOURAL RESEARCH",
    "",
    "A personal selection of participant-proposed strategies from Table 3. These are not ranked or tested interventions.",
    "",
    ...items.flatMap((strategy) => [
      `${strategy.id}. ${strategy.title}`,
      ...strategy.actions.map((action) => `  [ ] ${action}`),
      "",
    ]),
    "Source: " + CITATION,
    "Strategy titles and actions reproduced verbatim from Table 3. Original article: CC BY 4.0.",
    "Strategies reflect the UK study context and may require adaptation elsewhere.",
    "",
    "Reopen this selection: " + makeShareUrl(saved),
  ].join("\n");
}

export function PlanDialog({
  open,
  onClose,
  saved,
  onRemove,
  storageAvailable,
}: {
  open: boolean;
  onClose: () => void;
  saved: number[];
  onRemove: (id: number) => void;
  storageAvailable: boolean;
}) {
  const [feedback, setFeedback] = useState("");
  const items = strategies.filter((strategy) => saved.includes(strategy.id));
  async function copy(kind: "plan" | "link") {
    const success = await copyText(
      kind === "plan" ? planText(saved) : makeShareUrl(saved),
    );
    setFeedback(
      success
        ? kind === "plan"
          ? "Your action plan has been copied."
          : "Link copied. It includes your selected role, strategy and saved plan."
        : "Copy was unavailable. Download your plan to keep a copy.",
    );
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([planText(saved)], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-behavioural-research-action-plan.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFeedback("Your action plan has been downloaded.");
  }
  return (
    <Modal open={open} onClose={onClose} title="Your next steps" wide>
      <p className="modal-intro">
        A small place to start. A bigger change to work towards.
      </p>
      <p className="saved-note">
        {storageAvailable
          ? "Your selection is saved in this browser. Copy or download it to keep and share."
          : "Browser storage is unavailable. Copy or download your plan to keep it."}
      </p>
      {items.length ? (
        <>
          <ol className="saved-strategies">
            {items.map((strategy) => (
              <li key={strategy.id}>
                <div className="saved-item-heading">
                  <span className="saved-number">
                    {strategyNumber(strategy.id)}
                  </span>
                  <h3>
                    <StrategyTitle title={strategy.title} />
                  </h3>
                  <button
                    className="icon-button"
                    aria-label={`Remove strategy ${strategy.id} from your plan`}
                    onClick={() => onRemove(strategy.id)}
                  >
                    <Icon name="close" size={18} />
                  </button>
                </div>
                <ul>
                  {strategy.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <div className="plan-actions">
            <button className="primary-button" onClick={download}>
              <Icon name="download" />
              Download plan
            </button>
            <button className="secondary-button" onClick={() => copy("plan")}>
              <Icon name="copy" />
              Copy plan
            </button>
            <button className="text-button" onClick={() => copy("link")}>
              Copy link
              <Icon name="external" size={17} />
            </button>
            <button className="text-button" onClick={() => window.print()}>
              <Icon name="print" size={17} />
              Print / save PDF
            </button>
          </div>
        </>
      ) : (
        <div className="empty-plan">
          <h3>Every plan starts with one step.</h3>
          <p>
            Explore the strategies and save the ones you want to take forward.
          </p>
          <button className="primary-button" onClick={onClose}>
            Explore strategies
            <Icon name="arrow" />
          </button>
        </div>
      )}
      <p className="feedback" role="status">
        {feedback}
      </p>
      <p className="plan-citation">
        These are participant-proposed strategies, not tested interventions.
        Strategy titles and actions reproduced verbatim from{" "}
        <a href={TABLE_URL} target="_blank" rel="noreferrer">
          Table 3, Yang et al., PLOS One (2026)
        </a>
        . CC BY 4.0.
      </p>
    </Modal>
  );
}
