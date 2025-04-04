import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBJdMVlwY9rCJ1S7NI_7-jvZtky5nUX0-4",
  authDomain: "pharaohs-83691.firebaseapp.com",
  projectId: "pharaohs-83691",
  storageBucket: "pharaohs-83691.firebasestorage.app",
  messagingSenderId: "992289513045",
  appId: "1:992289513045:web:9f3e3d6646b5f20672bedc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();