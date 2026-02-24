// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { useObject } from "react-firebase-hooks/database";

export const useData = (path, transform) => {
  const [snapshot, loading, error] = useObject(ref(database, path));
  let data;

  if (snapshot) {
    const value = snapshot.val();
    data = !loading && !error && transform ? transform(value) : value;
  }

  return [data, loading, error];
};

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuAMH4Uks5wbMyTER5N6jBie10GCF1Qeo",
  authDomain: "ubiqum-u3-schedule.firebaseapp.com",
  databaseURL: "https://ubiqum-u3-schedule-default-rtdb.firebaseio.com",
  projectId: "ubiqum-u3-schedule",
  storageBucket: "ubiqum-u3-schedule.firebasestorage.app",
  messagingSenderId: "1000622096783",
  appId: "1:1000622096783:web:5440435eb9996ae89c4bfa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
