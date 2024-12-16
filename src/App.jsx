import React, { useState, useEffect } from "react";
import { Button, Input } from "react-daisyui";
import { Hero } from "react-daisyui";
import { useNavigate } from "react-router-dom";
import { database, ref, set, get } from "./firebase"; // Import necessary Firebase methods

const App = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null); // State to hold the image
  const [error, setError] = useState(""); // State to hold the error message

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

  // Set the random image only once when the component mounts
  useEffect(() => {
    const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    setImage(randomImage);

    // Force the theme to be light only, even on page refresh
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  // Check if the name is unique by querying Firebase (case-insensitive check)
  const checkIfNameExists = async (name) => {
    const usersRef = ref(database, "users");
    const snapshot = await get(usersRef);
    const usersData = snapshot.val();

    if (!usersData) {
      return false; // No users in the database yet
    }

    // Normalize both input and stored names for case-insensitive comparison
    const normalizedName = name.trim().toLowerCase();
    for (let id in usersData) {
      if (usersData[id].name.trim().toLowerCase() === normalizedName) {
        return true; // Name already exists
      }
    }
    return false; // Name is unique
  };

  const handleNavigate = async () => {
    if (name.trim()) {
      const isNameTaken = await checkIfNameExists(name);

      if (isNameTaken) {
        setError("This name is already taken. Please choose a different name.");
      } else {
        // Save user data to Firebase
        set(ref(database, "users/" + Date.now()), {
          name: name,
          image: image, // Use the selected image
        });

        // Navigate to Lobby page with name and image as state
        navigate("/lobby", { state: { name: name, image: image } });
      }
    }
  };

  return (
    <Hero className="min-h-screen bg-base-200 flex items-center justify-center bg-gradient-to-t from-purple-500 to-indigo-500">
      <Hero.Content className="text-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-8">Kiran's Wedding Quiz!</h1>
          {image && (
            <img
              src={image} // Display the fixed image
              alt="Profile"
              className="w-56 h-56 rounded-full mx-auto mb-8"
            />
          )}
          <Input
  className="input input-bordered input-rounded border-black text-black focus:border-black focus:ring-0 mb-4"
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
/>

          {error && <p>{error}</p>}
          <div>
            <Button
              color="primary"
              className="btn btn-primary mt-4"
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
