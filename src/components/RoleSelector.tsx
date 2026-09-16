import { roles, type RoleId } from "../data/strategies";

export function RoleSelector({
  selected,
  onSelect,
}: {
  selected: RoleId;
  onSelect: (id: RoleId) => void;
}) {
  return (
    <section className="role-column" aria-labelledby="role-heading">
      <h2 className="step-heading" id="role-heading">
        <span>01</span>Choose your role
      </h2>
      <div className="role-options" role="group" aria-label="Choose your role">
        {roles.map((role) => (
          <button
            key={role.id}
            className={`role-option ${selected === role.id ? "is-selected" : ""}`}
            aria-pressed={selected === role.id}
            onClick={() => onSelect(role.id)}
          >
            <span className="role-dot" aria-hidden="true" />
            <span>{role.label}</span>
          </button>
        ))}
      </div>
      <select
        className="role-select"
        aria-labelledby="role-heading"
        value={selected}
        onChange={(event) => onSelect(event.target.value as RoleId)}
      >
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.label}
          </option>
        ))}
      </select>
    </section>
  );
}
