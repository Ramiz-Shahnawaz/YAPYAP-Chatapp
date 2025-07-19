// Import the functions from the SDKs needed
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_Firebase_apikey,
  authDomain: import.meta.env.VITE_authdomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storagebucket,
  messagingSenderId: import.meta.env.VITE_message_senderID,
  appId: import.meta.env.VITE_appID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
export const auth = getAuth(app);
export const db = getFirestore(app);