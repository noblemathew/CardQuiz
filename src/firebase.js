import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child , onValue ,update, remove} from "firebase/database"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApIaeWXiAMBa6q3D7hKndZ85R6X9-niQY",
  authDomain: "quiz-2b538.firebaseapp.com",
  projectId: "quiz-2b538",
  storageBucket: "quiz-2b538.firebasestorage.app",  
  messagingSenderId: "39049773467",
  appId: "1:39049773467:web:c7aabfd458e2a2c46e613e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);  // Get a reference to the database

// Export the functions you need
export { database, ref, set, get, child, onValue,update, remove };
