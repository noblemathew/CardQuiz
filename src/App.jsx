import React, { useEffect, useState } from "react";
import { Button, Input } from "react-daisyui";
import { Hero } from "react-daisyui";
import { useNavigate } from "react-router-dom";
import { database, ref, set } from "./firebase";

const App = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);  // State to hold the image

  // Array of image links
  const imageLinks = [
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM25mM3g4M2NyMHJyeWh5aGQ1Y2wxbnMzZmh1Nmt2NXF5aXQyb2dzMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oriO4kSYahYQr6e1a/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHczam5veTkyemM0MXBnY3o3aDJ0bGt6MDI0djl3bjVyYzh3eDE2NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0IpXwyCXikRK9Yl2/giphy.gif",
    // Add more images here
  ];

  // Set the random image only once when the component mounts
  useEffect(() => {
    const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    setImage(randomImage);  // Set the image once on mount

    // Force the theme to be light only, even on page refresh
    document.documentElement.setAttribute("data-theme", "light");
  }, []);  // Empty dependency array ensures this only runs once

  const handleNavigate = () => {
    if (name.trim()) {
      // Save user data to Firebase
      set(ref(database, "users/" + Date.now()), {
        name: name,
        image: image,  // Use the selected image
      });

      // Navigate to Quiz page with name and image as state
      navigate("/quiz", { state: { name: name, image: image } });
    }
  };

  return (
    <Hero className="min-h-screen bg-base-200 flex items-center justify-center bg-gradient-to-t from-purple-500 to-indigo-500">
      <Hero.Content className="text-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-8">Kiran's Wedding Quiz!</h1>
          {image && (
            <img
              src={image}  // Display the fixed image
              alt="Profile"
              className="w-56 h-56 rounded-full mx-auto mb-8"
            />
          )}
          <Input
            className="input input-bordered input-rounded border-black text-black focus:border-black focus:ring-0 mb-4"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}  // Only updates name, not image
          />
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
