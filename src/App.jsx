import React, { useState, useEffect } from "react";
import { Button, Input } from "react-daisyui";
import { Hero } from "react-daisyui";
import { useNavigate } from "react-router-dom";
import { database, ref, set, get } from "./firebase";

const App = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const imageLinks = [
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM25mM3g4M2NyMHJyeWh5aGQ1Y2wxbnMzZmh1Nmt2NXF5aXQyb2dzMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oriO4kSYahYQr6e1a/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHczam5veTkyemM0MXBnY3o3aDJ0bGt6MDI0djl3bjVyYzh3eDE2NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0IpXwyCXikRK9Yl2/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGYwcmZvbDJlb3V5OTM0aXZzemJud3g2d3NyamdhZmFrcTJob2J2YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2JJEjOrkIzRPfFao/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExa29sNnRoMHc2Z2NkNHYxNWJpMmF0OG9wMGxwM2RpcHoyamN2a3BweiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKJeRhSZDX3dCbm/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnBpeGhpdGt3OTVhMzhqbTVjb3J6MXpsaDRuOHZnZTc3bGJ6NmZ3eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ogy9H6ggNvHKo/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnZra2RlanlhY3NvZ3p4ZGpucDkxdWg2NWlydXk3cjRyajgyY3U5aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kFeF021b3ABCKSLxcm/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnlpZXo5dzhycG5pdTdndWxoamRzd2RuaGdvZHo2Nm1qeGsxaHJ6OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5BuYzSHaxflSQyFmpA/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmRweXhhczQwMGRwdmd4aGVsbXBvN25wYnFtdXBobXhlcDQybWJkbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JvlJSmxmKSXyE/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXo2a291M3BiemJtZWJnbzA4aDRuczNuemU0M202bWl5bXJveXRrcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1IEJh4dNqYT6xHOJAL/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXV5eDR4eDZ0bjR4ZHJ6eHVoaWk5NTdlamp0NDZibXphMHEyZHQ5ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13bowzwNtiuqNF2pav/giphy.gif"
  ];

  useEffect(() => {
    const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    setImage(randomImage);
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  const checkIfNameExists = async (name) => {
    const usersRef = ref(database, "users");
    const snapshot = await get(usersRef);
    const usersData = snapshot.val();

    if (!usersData) {
      return false;
    }

    const normalizedName = name.trim().toLowerCase();
    for (let id in usersData) {
      if (usersData[id].name.trim().toLowerCase() === normalizedName) {
        return true;
      }
    }
    return false;
  };

  const handleNavigate = async () => {
    if (name.trim()) {
      const isNameTaken = await checkIfNameExists(name);

      if (isNameTaken) {
        setError("This name is already taken. Please choose a different name.");
      } else {
        set(ref(database, "users/" + Date.now()), {
          name: name,
          image: image,
        });
        navigate("/lobby", { state: { name: name, image: image } });
      }
    }
  };

  return (
    <Hero className="min-h-screen bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <Hero.Content className="text-center p-6">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Quiz!</h1>
            <p className="text-gray-600 mb-8">Get ready to test your knowledge and have fun!</p>
            {image && (
              <img
                src={image}
                alt="Profile"
                className="w-40 h-40 mx-auto rounded-full mb-6 border-4 border-purple-500 shadow-lg"
              />
            )}
            <Input
              className="input input-bordered w-full text-black mb-4 px-4 py-3 rounded-full focus:ring focus:ring-purple-300"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button
              color="primary"
              className="btn btn-primary w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md transform transition-transform hover:scale-105"
              onClick={handleNavigate}
            >
              START
            </Button>
          </div>
        </div>
      </Hero.Content>
    </Hero>
  );
};

export default App;
