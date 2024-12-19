import React, { useState, useEffect } from "react";
import { Button, Card } from "react-daisyui";
import { database, ref, onValue, set } from "./firebase"; // Import 'set' for updating data
import { useNavigate } from "react-router-dom";

const pastelColors = [
  "#FAD02E", "#F28D35", "#D83367", "#4D4D77", "#A7A6CB", "#B8E0D2", 
  "#A9D0D1", "#FFB6B9", "#E1BBE2", "#C8A2C8"
];

const Admin = () => {
  const [players, setPlayers] = useState([]); // Store the list of players
  const [gameStatus, setGameStatus] = useState("waiting"); // Game status (waiting, started, ended)
  const [typingText, setTypingText] = useState(""); // Text for typing effect
  const [currentPlayerCount, setCurrentPlayerCount] = useState(0); // Track player count
  const [typingIndex, setTypingIndex] = useState(0); // Index for typing progress

  const navigate = useNavigate(); // Initialize navigation hook

  useEffect(() => {
    // Listen for changes in the "users" node to fetch the player list
    const playersRef = ref(database, "users");
    onValue(playersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const playerList = Object.values(data);
        setPlayers(playerList);
        setCurrentPlayerCount(playerList.length);
      }
    });

    // Listen for changes in the "game" node
    const gameRef = ref(database, "game");
    onValue(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setGameStatus(data.status || "waiting");
      }
    });
  }, []);

  useEffect(() => {
    const message = "Players in the Lobby."; // The static text part
    const fullMessage = `${message} (${currentPlayerCount})`; // Full message including player count
    
    const interval = setInterval(() => {
      setTypingIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex > 3) {
          // Reset to start typing the dots again
          return 0;
        }
        return nextIndex;
      });
    }, 300); // Adjust typing speed (300ms for dots)

    return () => clearInterval(interval); // Cleanup the interval when component unmounts
  }, [currentPlayerCount]);

  useEffect(() => {
    const message = "Players in the Lobby"; // The static text part
    const fullMessage = `${message} (${currentPlayerCount})`; // Full message including player count
    const dots = ".".repeat(typingIndex); // Generate the dots based on typing index
    setTypingText(`${fullMessage}${dots}`); // Update the text with the dots
  }, [typingIndex, currentPlayerCount]);

  // Start the game and update the game status in Firebase
  const handleStartGame = () => {
    const gameRef = ref(database, "game/status");
    set(gameRef, "started"); // Update the game status to "started"
    navigate("/quizadmin"); // Navigate to the quizadmin page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center p-8">
      <h1 className="text-5xl font-bold text-white mb-6">Quiz Game</h1>

      <Card className="mb-6 shadow-lg p-6 rounded-xl bg-white bg-opacity-60">
        <h2 className="text-2xl font-semibold text-black mb-4 text-center">
          {typingText} {/* Display the typing text */}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {players.length > 0 ? (
            players.map((player, index) => (
              <div key={index} className="flex justify-center">
                <Card 
                  className="w-full max-w-sm shadow-lg rounded-lg mb-6 pt-6 pb-4" 
                  style={{ backgroundColor: pastelColors[index % pastelColors.length] }}>
                  <Card.Body className="p-4 pt-8 text-center">
                    <Card.Image
                      src={player.image}
                      alt="Player Avatar"
                      className="rounded-full w-24 h-24 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-semibold text-black">{player.name}</h3>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p className="text-center text-black">No players yet. Waiting for others to join...</p>
          )}
        </div>
      </Card>

      {/* Game control section */}
      <Card className="mb-6 shadow-lg p-6 rounded-xl bg-white bg-opacity-60">
        {gameStatus === "waiting" && (
          <div className="text-center">
            <Button color="primary" className="text-white text-2xl px-8 py-4" onClick={handleStartGame}>
              Start Game
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Admin;
