import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export const SCREENS = {
  WELCOME: 'Welcome',
  LOGIN: 'Login',
  REGISTER: 'Register',
  HOME: 'Home',
  NEW_HABIT: 'NewHabit',
  PROGRESSION: 'Progression',
};

export const COLORS = {
  BACKGROUND: '#000000',
  PRIMARY: '#5B21B6',
  ROXO_FRACO: '#8A5AD6',
  SECONDARY: '#A78BFA',
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
    paddingHorizontal: 20,
  },
  
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
