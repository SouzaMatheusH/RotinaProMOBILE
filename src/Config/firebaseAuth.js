import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword as fbCreateUser,
  signInWithEmailAndPassword as fbSignInUser,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import firebaseConfig from '../Config/firebaseConfig'; 

WebBrowser.maybeCompleteAuthSession();

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, { 
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export function onAuthStateChanged(callback) {
  return fbOnAuthStateChanged(auth, callback);
}

export function getFriendlyErrorMessage (errorCode) {
 switch (errorCode) {
 case 'auth/user-not-found':
 case 'auth/wrong-password':
 return 'Email ou senha inválidos. Tente novamente.';
 case 'auth/email-already-in-use':
 return 'Este email já está cadastrado.';
 case 'auth/invalid-email':
 return 'O formato do email é inválido.';
 case 'auth/weak-password':
 return 'A senha deve ter pelo menos 6 caracteres.';
 default:
 return 'Ocorreu um erro desconhecido. Tente novamente.';
 }
}

export async function signInWithEmailAndPassword(email, password) {
 return await fbSignInUser (auth, email, password);
}

export async function createUserWithEmailAndPassword(email, password) {
 return await fbCreateUser (auth, email, password);
}

export async function signOut() {
 return await fbSignOut(auth);
}

export async function signinWithGoogle() {
 throw new Error("A função signinWithGoogle deve ser chamada do WelcomeScreen para usar o hook do Expo.");
}