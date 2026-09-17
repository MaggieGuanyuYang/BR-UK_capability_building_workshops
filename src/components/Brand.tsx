export function Brand() {
  return (
    <span className="brand-lockup">
      <img
        className="brand-mark"
        src={`${import.meta.env.BASE_URL}brand/br-uk-mark.svg`}
        width="44"
        height="44"
        alt=""
        aria-hidden="true"
      />
      <span className="brand-text">
        <span className="brand-title">
          Findings from capability building workshops
        </span>
        <span className="brand-subtitle">Behavioural Research UK</span>
      </span>
    </span>
  );
}
