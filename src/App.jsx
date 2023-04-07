import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Question from "./components/Question";

import "./index.css";

function App() {
  const [restart, setRestart] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({});
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    fetch(
      "https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple"
    )
      .then((res) => res.json())
      .then((data) => {
        setQuestions(
          data.results.map((q) => {
            return {
              ...q,
              id: `q-${nanoid()}`,
              choices: [...q.incorrect_answers, q.correct_answer].sort(
                () => Math.random() - 0.5
              ),
            };
          })
        );
        setFormData(
          questions.reduce((acc, curr) => {
            acc[curr.id] = "";
            return acc;
          }, {})
        );
      });
  }, [restart]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
    checkIfDone();
  }

  function checkIfDone() {
    let allFilledOut = true;
    document.querySelectorAll("fieldset").forEach((fieldset) => {
      const radio = fieldset.querySelector("input:checked");
      if (!radio) {
        allFilledOut = false;
      }
    });
    setIsDone(allFilledOut);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (submitted) {
      setRestart(!restart);
      setSubmitted(false);
      setIsDone(false);
      setQuestions([]);
      return;
    }

    const score = questions.reduce((acc, curr) => {
      return formData[curr.id] === curr.correct_answer ? acc + 1 : acc;
    }, 0);
    setResults({score, total: questions.length });
    setSubmitted(true);
  }

  const questionElements = questions.map((q) => {
    return (
      <Question
        data={q}
        handleChange={handleChange}
        selectedCh={formData[q.id]}
        isSubmitted={submitted}
        key={q.id}
      />
    );
  });

  if (questions.length === 0) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <>
      <header className="container">
        <h1 className="heading">Quiz App</h1>
      </header>
      <main className="container">
        <form className="form" onSubmit={handleSubmit}>
          {questionElements}
          <div className="form--info">
            {submitted && (
              <div className="form--info-text">
                {results.score > 0
                  ? `You got ${results.score}/${results.total} 
                  ${results.score > 1 ? "questions" : "question"} right!`
                  : "Keep on practicing, you got this!"}
              </div>
            )}
            <button disabled={!isDone}>
              {submitted ? "New Quiz" : "Done"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

export default App;
