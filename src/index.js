import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Lobby from "./lobby";
import Quiz from "./Quiz";
import Admin from "./Admin"; // Import the Admin component
import "./tailwind.css"; // Import Tailwind if required globally
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuizAdmin from "./QuizAdmin";

const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/admin" element={<Admin />} /> {/* Add this route */}
      <Route path="/quizadmin" element={<QuizAdmin />} /> {/* Add this route */}
    </Routes>
  </BrowserRouter>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
