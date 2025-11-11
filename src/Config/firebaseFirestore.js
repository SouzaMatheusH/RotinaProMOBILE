import { getFirestore } from "firebase/firestore";
import { app } from "./firebaseAuth";

export const db = getFirestore(app);