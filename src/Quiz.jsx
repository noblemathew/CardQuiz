import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, onValue, push } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useLocation } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Correct import


// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyApIaeWXiAMBa6q3D7hKndZ85R6X9-niQY",
  authDomain: "quiz-2b538.firebaseapp.com",
  projectId: "quiz-2b538",
  storageBucket: "quiz-2b538.firebasestorage.app",
  messagingSenderId: "39049773467",
  appId: "1:39049773467:web:c7aabfd458e2a2c46e613e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const Quiz = () => {
  const location = useLocation();
  const { name } = location.state || {}; // Get user's name passed via state

  const questions = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Paris", "Rome", "Berlin", "Madrid"],
      correct: "Paris",
    },
    {
      id: 2,
      question: "What is the largest planet in the solar system?",
      options: ["Mars", "Earth", "Jupiter", "Saturn"],
      correct: "Jupiter",
    },
    {
      id: 3,
      question: "Who wrote 'Hamlet'?",
      options: ["Shakespeare", "Tolstoy", "Homer", "Plato"],
      correct: "Shakespeare",
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [responses, setResponses] = useState({});
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  // Listen to responses in Firebase
  useEffect(() => {
    const responsesRef = ref(db, "responses");
    onValue(responsesRef, (snapshot) => {
      if (snapshot.exists()) {
        setResponses(snapshot.val());
      }
    });
  }, []);

  // Handle option click
  const handleOptionClick = (selectedOption) => {
    const isCorrect = selectedOption === currentQuestion.correct;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    // Log the user's response in Firebase
    const questionId = currentQuestion.id;
    const responsesRef = ref(db, `responses/${questionId}`);
    const newResponse = {
      name,
      selectedOption,
      isCorrect,
      timestamp: Date.now(),
    };

    // Push response to Firebase
    push(responsesRef, newResponse);

    // Show scoreboard after the current question
    setShowScoreboard(true);
  };

  // Proceed to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setShowScoreboard(false);
    } else {
      alert("Quiz Finished! Thanks for playing.");
    }
  };

  // Generate histogram data for the scoreboard
  const generateHistogramData = () => {
    const currentResponses = responses[currentQuestion.id] || {};
    const scores = {};

    // Calculate scores for each user
    Object.values(currentResponses).forEach((response) => {
      if (response.isCorrect) {
        scores[response.name] = (scores[response.name] || 0) + 1;
      }
    });

    return {
      labels: Object.keys(scores),
      datasets: [
        {
          label: "Score",
          data: Object.values(scores),
          backgroundColor: "rgba(75,192,192,1)",
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-purple-500 to-indigo-500 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 text-center">
        {showScoreboard ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">Scoreboard</h1>
            <div className="mb-4">
              <Bar data={generateHistogramData()} />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex === questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h1>
            <p className="mb-6 text-xl">{currentQuestion.question}</p>
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className="btn btn-outline text-lg"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
