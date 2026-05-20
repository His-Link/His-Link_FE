function ComingSoonPanel({ message }) {
  return (
    <div className="coming-soon-panel">
      <span className="coming-soon-panel__icon" aria-hidden="true">
        ◇
      </span>
      <p>{message}</p>
    </div>
  );
}

export default ComingSoonPanel;
