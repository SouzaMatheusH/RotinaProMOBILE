// src/styles/theme.js
import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

// NOVO: Definição e Exportação do objeto SCREENS
export const SCREENS = {
  WELCOME: 'Welcome',
  LOGIN: 'Login',
  REGISTER: 'Register',
  HOME: 'Home',
  NEW_HABIT: 'NewHabit',
  PROGRESSION: 'Progression', // <-- NOVO
};

// Cores baseadas no seu PDF
export const COLORS = {
  BACKGROUND: '#000000',
  PRIMARY: '#5B21B6', // Roxo Principal (Forte)
  ROXO_FRACO: '#8A5AD6', // Roxo Fraco (Intermediário - para progresso parcial) <-- NOVO
  SECONDARY: '#A78BFA', // Roxo Secundário (Claro)
  TERTIARY: '#C4B5FD',
  WHITE: '#FFFFFF',
  TEXT_LIGHT: '#E5E5E5',
  TEXT_DARK: '#1F1F1F',
  ERROR: '#DC2626',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: 20, // Removendo o padding geral para controle em cada tela
    // Removido o justifyContent: 'center' para permitir scroll nas telas
  },
  // ... (Resto dos seus estilos globais)
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.WHITE,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  authContainer: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoPlaceholder: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 20,
  },
  linkText: {
    color: COLORS.SECONDARY,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 15,
  },
  errorText: {
    color: COLORS.ERROR,
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  }
});
