function ScoreField({ label, name, value, onChange, required = true }) {
  return (
    <div className="lab-score-field">
      <span className="lab-score-field__label">
        {label}
        {required && <span className="lab-score-field__req">*</span>}
      </span>
      <div className="lab-score-field__options" role="group" aria-label={label}>
        {[1, 2, 3, 4, 5].map((score) => (
          <label key={score} className="lab-score-field__option">
            <input
              type="radio"
              name={name}
              value={score}
              checked={Number(value) === score}
              onChange={() => onChange(score)}
              required={required}
            />
            <span>{score}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default ScoreField;
