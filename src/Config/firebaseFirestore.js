// src/Config/firebaseFirestore.js
import { getFirestore } from "firebase/firestore";
import { app } from "./firebaseAuth"; // já existe no seu firebaseAuth.js

export const db = getFirestore(app);