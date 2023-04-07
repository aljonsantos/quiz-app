export default function Question(props) {
  const data = props.data;

  function choiceElement(ch, i) {
    const chId = `${data.id}-ch${i + 1}`;
    return (
      <div key={chId}>
        <input
          type="radio"
          id={chId}
          name={data.id}
          value={ch}
          checked={props.selectedCh === ch}
          onChange={props.handleChange}
          disabled={props.isSubmitted}
          className={
            props.isSubmitted
              ? `${ch === data.correct_answer ? "correct" : "incorrect"}`
              : ""
          }
        />
        <label
          htmlFor={chId}
          className="field--choice"
          dangerouslySetInnerHTML={{ __html: ch }}
        ></label>
      </div>
    );
  }

  return (
    data && (
      <div className="form--field">
        <p
          className="field--title"
          dangerouslySetInnerHTML={{ __html: data.question }}
        ></p>
        <fieldset className="field--choices">
          {data.choices.map((ch, i) => choiceElement(ch, i))}
        </fieldset>
      </div>
    )
  );
}
