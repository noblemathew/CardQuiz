import React, { useState, useEffect } from "react";
import { Button, Card } from "react-daisyui";
import { useNavigate, useLocation } from "react-router-dom";
import { database, ref, onValue } from "./firebase";

const pastelColors = [
  "#FAD02E", "#F28D35", "#D83367", "#4D4D77", "#A7A6CB", "#B8E0D2", 
  "#A9D0D1", "#FFB6B9", "#E1BBE2", "#C8A2C8"
];

const Lobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, image } = location.state || {}; // Access the passed state
  const [users, setUsers] = useState([]); // State to store users
  const [gameStatus, setGameStatus] = useState("waiting"); // State to track the game status

  // Fetch users from Firebase when the component mounts
  useEffect(() => {
    const usersRef = ref(database, "users"); // Reference to the 'users' node in Firebase

    // Listen for real-time updates
    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      const usersList = [];

      // Convert the Firebase data into an array of users
      for (let id in usersData) {
        usersList.push(usersData[id]);
      }

      setUsers(usersList); // Update the state with the users
    });

    // Listen for game status changes
    const gameRef = ref(database, "game/status"); // Reference to the 'status' node in the 'game' node
    onValue(gameRef, (snapshot) => {
      const status = snapshot.val();
      setGameStatus(status);

      if (status === "started") {
        // Navigate to quiz page when game starts
        navigate("/quiz", { state: { name, image } });
      }
    });

    // Set the theme to light only
    document.documentElement.setAttribute("data-theme", "light");
  }, [navigate, name, image]); // Dependency array includes navigate, name, and image

  // Filter users to only show the current user who entered the name
  const currentUser = users.find((user) => user.name === name);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center bg-gradient-to-t from-purple-500 to-indigo-500">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to the Lobby!</h1>

        <h3 className="text-xl mb-4">
          Waiting for the host to start<span className="dots"></span>
        </h3>

        <style jsx>{`
          .dots::after {
            content: "."; 
            animation: typing 1.5s infinite step-end;
          }

          .dots::after {
            content: "";
            animation: dots 1.5s infinite;
          }

          @keyframes dots {
            0% {
              content: ".";
            }
            33% {
              content: "..";
            }
            66% {
              content: "...";
            }
            100% {
              content: ".";
            }
          }
        `}</style>

        <div className="flex flex-wrap justify-center">
          {/* Render only the current user */}
          {currentUser ? (
            <div className="m-4">
              <Card className="w-48 shadow-lg rounded-lg mb-6 mt-4 pt-4 pb-3" 
                    style={{ backgroundColor: pastelColors[0] }}>
                <Card.Image
                  src={currentUser.image}
                  alt="Player"
                  className="rounded-full w-24 h-24 mx-auto mt-4"
                />
                <Card.Body>
                  <h2 className="text-center text-xl font-bold mt-2">{currentUser.name}</h2>
                </Card.Body>
              </Card>
            </div>
          ) : (
            <p>No players yet. Waiting for others to join...</p>
          )}
        </div>

        {gameStatus === "ended" && (
          <p className="mt-8 text-red-600 text-lg font-semibold">
            Game has ended!
          </p>
        )}
      </div>
    </div>
  );
};

export default Lobby;
