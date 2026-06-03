function ScoreField({ label, name, value, onChange, required = true, error }) {
  return (
    <div className={`lab-score-field${error ? " lab-score-field--error" : ""}`}>
      <span className="lab-score-field__label">
        {label}
        {required && <span className="lab-score-field__req">*</span>}
      </span>
      <div className="lab-score-field__stars" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((score) => (
          <label key={score} className="lab-score-field__star-label">
            <input
              type="radio"
              name={name}
              value={score}
              checked={Number(value) === score}
              onChange={() => onChange(score)}
              required={required}
              className="lab-score-field__input"
            />
            <span
              className={`lab-score-field__star${
                Number(value) >= score ? " lab-score-field__star--on" : ""
              }`}
              aria-hidden="true"
            >
              ★
            </span>
          </label>
        ))}
        <span className="lab-score-field__value">{value ? `${value}점` : "선택"}</span>
      </div>
      {error && <p className="lab-field-error">{error}</p>}
    </div>
  );
}

export default ScoreField;
