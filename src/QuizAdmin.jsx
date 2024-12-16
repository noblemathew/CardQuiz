import React, { useState, useEffect } from "react";
import { database, ref, onValue, set } from "./firebase"; // Import Firebase methods

const QuizAdmin = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Start from the first question
  const [totalResponses, setTotalResponses] = useState(0); // Store total number of responses

  // Define questions statically
  const questions = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
    },
    {
      id: 2,
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
    },
    {
      id: 3,
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex]; // Get the current question based on the index

  // Fetch the current question index from Firebase database
  useEffect(() => {
    const questionIndexRef = ref(database, "game/currentQuestion");
    const unsubscribe = onValue(questionIndexRef, (snapshot) => {
      if (snapshot.exists()) {
        const newQuestionIndex = snapshot.val() - 1; // Firebase index is 1-based, adjust to 0-based
        setCurrentQuestionIndex(newQuestionIndex);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch the total number of responses for the current question
  useEffect(() => {
    const responsesRef = ref(database, `responses/${currentQuestionIndex + 1}`); // Use index+1 to match 1-based array
    const unsubscribeResponses = onValue(responsesRef, (snapshot) => {
      if (snapshot.exists()) {
        const responsesData = snapshot.val();
        console.log("Responses data:", responsesData); // Debug log

        // Count valid responses
        const validResponses = Object.values(responsesData || {}).filter(
          (response) => response !== null
        );

        const total = validResponses.length; // Count valid responses
        console.log("Valid Responses Count:", total); // Debug log

        setTotalResponses(total); // Update total responses
      } else {
        setTotalResponses(0); // Set total responses to 0 if no data is found
        console.log("No responses found.");
      }
    });

    return () => unsubscribeResponses();
  }, [currentQuestionIndex]); // Fetch responses when current question changes

  // Handle next question click
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      const gameRef = ref(database, "game/currentQuestion");
      set(gameRef, newIndex + 1); // Update Firebase (1-based index)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-500 to-cyan-500 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-2xl p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">{currentQuestion.question}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="p-4 rounded-lg text-lg font-semibold bg-gray-700">
              {option}
            </div>
          ))}
        </div>

        <div className="bg-gray-900 p-4 rounded-lg text-center mb-6">
          <h2 className="text-xl font-bold">Total Responses</h2>
          <p className="text-lg">
            {totalResponses} 
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={nextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg font-semibold disabled:opacity-50"
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizAdmin;
