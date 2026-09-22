import { roles } from "../data/strategies";
import { NetworkGraphic } from "./StrategyMap";
import { Brand } from "./Brand";

export function SocialCard({ square }: { square: boolean }) {
  return (
    <main className={`social-card ${square ? "square" : ""}`}>
      <div className="social-wordmark">
        <Brand />
      </div>
      <div className="social-content">
        <div className="social-message">
          <h1>
            What can you do to enhance <em>behavioural research capability?</em>
          </h1>
          <p>
            Choose your role.
            <br />
            Find your next step.
          </p>
          <div className="social-stats">
            <span>
              <strong>58</strong> participants
            </span>
            <span>
              <strong>5</strong> workshops
            </span>
            <span>
              <strong>10</strong> strategies
            </span>
          </div>
        </div>
        <div className="social-map">
          <NetworkGraphic role={roles[0]} selected={1} decorative />
        </div>
      </div>
      <footer>
        <p>Explore actions for researchers, practitioners, funders and more.</p>
        <span>
          Yang et al. · PLOS One · 2026
          <br />
          Participant-proposed strategies · doi:10.1371/journal.pone.0357909
        </span>
      </footer>
    </main>
  );
}
