import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Button } from "react-daisyui";

const Lobby = () => {
  const [users, setUsers] = useState([]); // State to store the list of users
  const navigate = useNavigate();
  const db = getDatabase();

  // Fetch users from Firebase in real-time
  useEffect(() => {
    const usersRef = ref(db, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.values(data);
        setUsers(usersList);
      } else {
        setUsers([]);
      }
    });

    return () => unsubscribe();
  }, [db]);

  // Handle start quiz button
  const handleStartQuiz = () => {
    // Navigate to the Quiz page
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-purple-500 to-indigo-500 flex items-center justify-center">
      <div className="max-w-lg bg-white shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Waiting Lobby</h1>
        <p className="text-lg mb-4">Users who have joined:</p>
        <ul className="mb-6">
          {users.map((user, index) => (
            <li key={index} className="flex items-center justify-center mb-4">
              <img
                src={user.image}
                alt="User"
                className="w-12 h-12 rounded-full mr-4"
              />
              <span className="text-lg">{user.name}</span>
            </li>
          ))}
        </ul>
        <Button color="primary" onClick={handleStartQuiz}>
          Start Quiz
        </Button>
      </div>
    </div>
  );
};

export default Lobby;
