import { useState } from "react";
import { Brand } from "./components/Brand";
import { AboutDialog, PlanDialog } from "./components/Dialogs";
import { Icon } from "./components/Icon";
import { RoleSelector } from "./components/RoleSelector";
import { StrategyDetail } from "./components/StrategyDetail";
import { StrategyMap } from "./components/StrategyMap";
import { PAPER_URL } from "./data/strategies";
import { useExplorer } from "./lib/state";

export default function App() {
  const explorer = useExplorer();
  const [dialog, setDialog] = useState<"about" | "plan" | null>(null);
  const [announcement, setAnnouncement] = useState("");

  function save() {
    const wasSaved = explorer.saved.includes(explorer.strategy.id);
    explorer.toggleSaved(explorer.strategy.id);
    setAnnouncement(
      `${explorer.strategy.title} ${wasSaved ? "removed from" : "added to"} your plan.`,
    );
  }

  function selectStrategy(id: number) {
    explorer.selectStrategy(id);
    setAnnouncement(
      `Showing strategy ${id}. Its actions are in the Put it into practice section.`,
    );
    if (window.matchMedia("(max-width: 700px)").matches) {
      requestAnimationFrame(() => {
        document
          .getElementById("strategy-title")
          ?.focus({ preventScroll: true });
        document.querySelector(".detail-column")?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
          block: "start",
        });
      });
    }
  }

  return (
    <>
      <a className="skip-link" href="#explorer">
        Skip to the strategy explorer
      </a>
      <div className={`page-shell ${explorer.saved.length ? "has-plan" : ""}`}>
        <header className="site-header">
          <a className="wordmark" href="./">
            <Brand />
          </a>
          <nav aria-label="Main navigation">
            <button className="header-link" onClick={() => setDialog("about")}>
              About the study
            </button>
            <a
              className="paper-button"
              href={PAPER_URL}
              target="_blank"
              rel="noreferrer"
            >
              Read the paper
              <Icon name="external" />
            </a>
          </nav>
        </header>
        <main>
          <section className="hero" aria-labelledby="page-title">
            <div className="hero-copy">
              <h1 id="page-title">
                What can you do to enhance{" "}
                <em>behavioural research capability?</em>
              </h1>
              <p>
                Choose your role. Explore the strategies. Find your next step.
              </p>
            </div>
            <div className="study-summary">
              <dl className="study-stats">
                <div>
                  <dt>participants</dt>
                  <dd>58</dd>
                </div>
                <div>
                  <dt>workshops</dt>
                  <dd>5</dd>
                </div>
                <div>
                  <dt>strategies</dt>
                  <dd>10</dd>
                </div>
              </dl>
              <p>Insights from a UK cross-sector study.</p>
            </div>
          </section>
          <div className="explorer" id="explorer" tabIndex={-1}>
            <RoleSelector
              selected={explorer.role.id}
              onSelect={(id) => {
                explorer.selectRole(id);
                setAnnouncement(
                  "Role changed. The map highlights the strategies linked to your role in Table 3.",
                );
              }}
            />
            <StrategyMap
              role={explorer.role}
              selected={explorer.strategy.id}
              onSelect={selectStrategy}
            />
            <StrategyDetail
              strategy={explorer.strategy}
              role={explorer.role}
              saved={explorer.saved.includes(explorer.strategy.id)}
              onSave={save}
            />
          </div>
        </main>
        <footer className="site-footer">
          <p>
            These are participant-proposed strategies, not tested interventions.
          </p>
          <a href={PAPER_URL} target="_blank" rel="noreferrer">
            Yang and Saunders et al. · PLOS One · 2026
          </a>
        </footer>
      </div>
      {explorer.saved.length > 0 && (
        <aside className="plan-tray" aria-label="Saved action plan">
          <div>
            <Icon name="check" />
            <span>
              <strong>
                {explorer.saved.length}{" "}
                {explorer.saved.length === 1 ? "strategy" : "strategies"} saved
              </strong>
              <span className="tray-description">
                Your next steps are taking shape.
              </span>
            </span>
          </div>
          <button className="primary-button" onClick={() => setDialog("plan")}>
            View your plan
            <Icon name="arrow" />
          </button>
        </aside>
      )}
      <AboutDialog open={dialog === "about"} onClose={() => setDialog(null)} />
      <PlanDialog
        open={dialog === "plan"}
        onClose={() => setDialog(null)}
        saved={explorer.saved}
        onRemove={explorer.toggleSaved}
        storageAvailable={explorer.storageAvailable}
      />
      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>
    </>
  );
}
