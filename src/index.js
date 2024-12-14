import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './tailwind.css'; // Import Tailwind here if required globally
import Quiz from "./Quiz";
import Lobby from './Lobby'; // Make sure this is the correct import
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/lobby" element={<Lobby />} /> {/* Corrected this */}
    </Routes>
  </BrowserRouter>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
