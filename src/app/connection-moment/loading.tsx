export default function ConnectionMomentLoading() {
  return (
    <div className="cm-shell cm-shell--loading">
      <div className="cm-shell-glow" aria-hidden />
      <div className="cm-shell-inner">
        <header className="cm-header">
          <span className="cm-header-wordmark font-display">Lovira</span>
        </header>
        <div className="cm-step cm-step--center">
          <p className="cm-lead">Preparing your moment together…</p>
        </div>
      </div>
    </div>
  );
}
