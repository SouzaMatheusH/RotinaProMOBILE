// src/App.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Importa as telas
import WelcomeScreen from './src/Pages/WelcomeScreen';
import LoginScreen from './src/Pages/LoginScreen';
import RegisterScreen from './src/Pages/RegisterScreen';
import HomeScreen from './src/Pages/HomeScreen';
import LoadingScreen from './src/Pages/LoadingScreen';
import NewHabitScreen from './src/Pages/NewHabitScreen';

// Importa estilos e cores
import { globalStyles, COLORS } from './src/Styles/theme';

// Importa a função de monitoramento do Firebase
import { onAuthStateChanged } from './src/Config/firebaseAuth';

const SCREENS = {
  WELCOME: 'Welcome',
  LOGIN: 'Login',
  REGISTER: 'Register',
  HOME: 'Home',
  NEW_HABIT: 'NewHabit',
};

const App = () => {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState(SCREENS.WELCOME);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);

  // 🔹 Monitoramento do Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
      setIsLoading(false);

      if (authUser) {
        if (!showLoadingAnimation) {
          setCurrentScreen(SCREENS.HOME);
        }
      } else {
        setCurrentScreen(SCREENS.WELCOME);
      }
    });

    return () => unsubscribe();
  }, [showLoadingAnimation]);

  const navigate = (screenName) => {
    setCurrentScreen(screenName);
  };

  const handleAuthSuccess = () => {
    // Mostra a animação de transição
    setShowLoadingAnimation(true);
  };

  const handleLogout = () => {
    // Ao sair, o listener do Firebase vai definir user = null
    setCurrentScreen(SCREENS.WELCOME);
  };

  // 🔹 Tela de carregamento inicial
  if (isLoading) {
    return (
      <View style={[globalStyles.container, styles.centerScreen]}>
        <Text style={{ color: COLORS.SECONDARY, fontSize: 20 }}>
          Conectando ao Firebase...
        </Text>
      </View>
    );
  }

  // 🔹 Roteamento das telas
  let ContentComponent;

  if (showLoadingAnimation) {
    ContentComponent = (
      <LoadingScreen
        onAnimationFinish={() => {
          setShowLoadingAnimation(false);
        }}
      />
    );
  } else if (user) {
    // Usuário logado
    switch (currentScreen) {
      case SCREENS.NEW_HABIT:
        ContentComponent = (
          <NewHabitScreen
            navigate={navigate}
            user={user} // ✅ Passa o usuário para salvar hábitos no Firestore
          />
        );
        break;

      case SCREENS.HOME:
      default:
        ContentComponent = (
          <HomeScreen
            user={user}
            onLogout={handleLogout}
            navigate={navigate}
          />
        );
        break;
    }
  } else {
    // Usuário deslogado
    switch (currentScreen) {
      case SCREENS.LOGIN:
        ContentComponent = (
          <LoginScreen
            navigate={navigate}
            onLoginSuccess={handleAuthSuccess}
          />
        );
        break;

      case SCREENS.REGISTER:
        ContentComponent = (
          <RegisterScreen
            navigate={navigate}
            onRegisterSuccess={handleAuthSuccess}
          />
        );
        break;

      case SCREENS.WELCOME:
      default:
        ContentComponent = <WelcomeScreen navigate={navigate} />;
        break;
    }
  }

  return ContentComponent;
};

const styles = StyleSheet.create({
  centerScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;