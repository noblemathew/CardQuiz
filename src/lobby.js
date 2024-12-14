import React, { useState, useEffect } from "react";
import { Button, Card, Image } from "react-daisyui"; // Import necessary DaisyUI components
import { useNavigate, useLocation } from "react-router-dom";
import { database, ref, onValue } from "./firebase"; // Firebase imports

const Lobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, image } = location.state || {}; // Access the passed state
  const [users, setUsers] = useState([]); // State to store users

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

    // Set the theme to light only
    document.documentElement.setAttribute("data-theme", "light");

  }, []); // Empty dependency array ensures this runs only once

  const handleStartQuiz = () => {
    // Navigate to quiz page and pass the user's name and image as state
    navigate("/quiz", { state: { name, image } });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center bg-gradient-to-t from-purple-500 to-indigo-500">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to the Lobby!</h1>


        <h3 className="text-xl mb-4">Players Ready to Play:</h3>

        <div className="flex flex-wrap justify-center">
          {/* Render the list of users as cards */}
          {users.length > 0 ? (
            users.map((user, index) => (
              <div key={index} className="m-4">
                <Card className="w-48 shadow-lg">
                  <Card.Image
                    src={user.image}
                    alt="Player"
                    className="rounded-full w-24 h-24 mx-auto mt-4"
                  />
                  <Card.Body>
                    <h2 className="text-center text-xl font-bold">{user.name}</h2>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p>No users yet. Waiting for others to join...</p>
          )}
        </div>

        <div className="mt-8">
          {/* Start Quiz Button */}
          <Button color="primary" onClick={handleStartQuiz}>
            Start Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
