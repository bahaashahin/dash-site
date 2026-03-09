import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSpUATJndLCNBhWyCiGYyqB5vaaSC029o",
  authDomain: "students-portal-94c83.firebaseapp.com",
  projectId: "students-portal-94c83",
  storageBucket: "students-portal-94c83.firebasestorage.app",
  messagingSenderId: "263319517521",
  appId: "1:263319517521:web:b3722d3ae8a931e52d7b70",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
