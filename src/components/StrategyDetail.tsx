import {
  TABLE_URL,
  strategyNumber,
  type Role,
  type Strategy,
} from "../data/strategies";
import { Icon } from "./Icon";
import { StrategyTitle } from "./StrategyTitle";

export function StrategyDetail({
  strategy,
  role,
  saved,
  onSave,
}: {
  strategy: Strategy;
  role: Role;
  saved: boolean;
  onSave: () => void;
}) {
  const relevant = strategy.roles.includes(role.id);
  return (
    <section className="detail-column" aria-labelledby="detail-step">
      <h2 className="step-heading" id="detail-step">
        <span>03</span>Put it into practice
      </h2>
      <article className="strategy-detail" aria-labelledby="strategy-title">
        <div className="detail-copy" key={strategy.id}>
          <p className="strategy-index">
            Strategy {strategyNumber(strategy.id)}
          </p>
          <h3 id="strategy-title" tabIndex={-1}>
            <StrategyTitle title={strategy.title} />
          </h3>
          {!relevant && (
            <p className="other-role-note">
              Exploring another strategy. Table 3 does not map this one to{" "}
              {role.label.toLowerCase()}.
            </p>
          )}
          <ul className="action-list">
            {strategy.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
        <div className="detail-bottom">
          <a
            className="source-link"
            href={TABLE_URL}
            target="_blank"
            rel="noreferrer"
          >
            See strategy {strategy.id} in Table 3
            <Icon name="external" size={17} />
          </a>
          <button
            className={`primary-button save-button ${saved ? "is-saved" : ""}`}
            onClick={onSave}
            aria-pressed={saved}
          >
            <Icon name={saved ? "check" : "plus"} />
            {saved ? "Saved to your plan" : "Save this strategy"}
          </button>
        </div>
      </article>
    </section>
  );
}
