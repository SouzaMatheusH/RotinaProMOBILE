// src/config/firebaseAuth.js
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

// EXPORTAÇÃO CRÍTICA: Inicializa e exporta o objeto auth
export const auth = initializeAuth(app, { 
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// A sua função wrapper de monitoramento que usa a instância 'auth'
export function onAuthStateChanged(callback) {
  return fbOnAuthStateChanged(auth, callback);
}

// Mapeamento de erros comuns do Firebase para mensagens amigáveis.
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

// Funções de Login, Cadastro, Logout (mantidas do seu PDF)
export async function signInWithEmailAndPassword(email, password) {
 return await fbSignInUser (auth, email, password);
}

export async function createUserWithEmailAndPassword(email, password) {
 return await fbCreateUser (auth, email, password);
}

export async function signOut() {
 return await fbSignOut(auth);
}

// Função de Login com Google (Incompleta no PDF original, mas deixo a estrutura)
export async function signinWithGoogle() {
 // Esta função precisa do request, response, promptAsync que estão no WelcomeScreen
 throw new Error("A função signinWithGoogle deve ser chamada do WelcomeScreen para usar o hook do Expo.");
}
