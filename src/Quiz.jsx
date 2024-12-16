import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database, ref, set, onValue } from "./firebase"; // Correctly import Firebase functions

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Start from the first question
  const [selectedOption, setSelectedOption] = useState(null); // User's selected option
  const [timer, setTimer] = useState(15); // 15-second timer
  const [waitingForNextQuestion, setWaitingForNextQuestion] = useState(false); // Waiting for the next question
  const [timesUp, setTimesUp] = useState(false); // Indicates if time is up
  const [responseTimeMessage, setResponseTimeMessage] = useState(""); // Stores the feedback message

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

  // Listen to currentQuestionIndex changes in Firebase
  useEffect(() => {
    const questionIndexRef = ref(database, "game/currentQuestion"); // Use the `database` from Firebase
    const unsubscribe = onValue(questionIndexRef, (snapshot) => {
      if (snapshot.exists()) {
        const newQuestionIndex = snapshot.val() - 1; // Assuming Firebase index starts at 1
        updateQuestionIndex(newQuestionIndex);
      }
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  useEffect(() => {
    if (currentQuestion && timer > 0 && !waitingForNextQuestion) {
      // Countdown timer logic
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown); // Clean up interval when component is unmounted or when timer stops
    } else if (timer === 0) {
      setTimesUp(true); // Time's up when the timer reaches 0
      setWaitingForNextQuestion(true); // Block further answers after time is up
    }
  }, [timer, currentQuestion, waitingForNextQuestion]);

  const handleOptionSelect = (option) => {
    if (!waitingForNextQuestion && !timesUp) {
      setSelectedOption(option);
      setWaitingForNextQuestion(true); // Prevent further selection after answering
      const responseTime = 15 - timer; // Calculate the response time

      // You can store the answer and response time here
      console.log("Answer:", option, "Response Time:", responseTime);

      // Display feedback based on response time
      if (responseTime <= 3) {
        setResponseTimeMessage("Wow, that was quick! 🔥");
      } else if (responseTime <= 6) {
        setResponseTimeMessage("Nice job! You're fast! ⚡");
      } else if (responseTime <= 10) {
        setResponseTimeMessage("Good choice! Keep it up! 👍");
      } else {
        setResponseTimeMessage("Took your time, huh? 🤔");
      }

      // Store the user's response in Firebase
      const userId = "user_123"; // Replace with actual user ID or generate dynamically
      const responseRef = ref(database, `responses/${currentQuestion.id}/${userId}`);
      set(responseRef, {
        option,
        responseTime, // Store the response time as well if needed
        timestamp: Date.now(), // Store the timestamp for sorting and reference
      });
    }
  };

  // Admin-controlled function to change the question (external trigger for next question)
  const updateQuestionIndex = (newIndex) => {
    setCurrentQuestionIndex(newIndex); // Update question index
    setSelectedOption(null); // Reset selected option
    setTimer(15); // Reset timer to 15 seconds
    setTimesUp(false); // Reset times up state
    setWaitingForNextQuestion(false); // Allow interaction with next question
    setResponseTimeMessage(""); // Reset feedback message
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">No more questions available</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-purple-500 to-indigo-500 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-2xl p-4 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">{currentQuestion.question}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`p-4 rounded-lg text-lg font-semibold ${
                selectedOption === option
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              disabled={waitingForNextQuestion || timesUp} // Disable buttons after selecting or when time's up
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {selectedOption && (
          <p className="mt-4 text-center text-lg">
            You selected: <span className="font-bold">{selectedOption}</span>
          </p>
        )}

        {!waitingForNextQuestion && (
          <div className="mt-6 text-center">
            <p className="text-xl font-bold">Time left: {timer} seconds</p>
          </div>
        )}

        {timesUp && (
          <div className="mt-6 text-center">
            <p className="text-2xl font-bold text-red-500">Time's Up!</p>
          </div>
        )}

        {responseTimeMessage && (
          <div className="mt-6 text-center">
            <p className="text-xl font-semibold text-yellow-400">{responseTimeMessage}</p>
          </div>
        )}

        {waitingForNextQuestion && !timesUp && (
          <div className="mt-6 text-center">
            <p className="text-xl font-bold">Waiting for the next question...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
