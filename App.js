import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import WelcomeScreen from './src/Pages/WelcomeScreen';
import LoginScreen from './src/Pages/LoginScreen';
import RegisterScreen from './src/Pages/RegisterScreen';
import HomeScreen from './src/Pages/HomeScreen';
import LoadingScreen from './src/Pages/LoadingScreen';
import NewHabitScreen from './src/Pages/NewHabitScreen';
import ProgressionScreen from './src/Pages/ProgressionScreen';

import { globalStyles, COLORS } from './src/Styles/theme';
import { onAuthStateChanged } from './src/Config/firebaseAuth';

const SCREENS = {
  WELCOME: 'Welcome',
  LOGIN: 'Login',
  REGISTER: 'Register',
  HOME: 'Home',
  NEW_HABIT: 'NewHabit',
  PROGRESSION: 'Progression',
};

const App = () => {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState(SCREENS.WELCOME);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  const [routeParams, setRouteParams] = useState(null);

  const [dailyProgress, setDailyProgress] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
      setIsLoading(false);
      if (authUser) setCurrentScreen(SCREENS.HOME);
      else setCurrentScreen(SCREENS.WELCOME);
    });
    return () => unsubscribe();
  }, []);

  const navigate = (screenName, params = null) => {
    setRouteParams(params);
    setCurrentScreen(screenName);
  };

  const handleAuthSuccess = () => setShowLoadingAnimation(true);
  const handleLogout = () => setCurrentScreen(SCREENS.WELCOME);

  if (isLoading) {
    return (
      <View style={[globalStyles.container, styles.centerScreen]}>
        <Text style={{ color: COLORS.SECONDARY, fontSize: 20 }}>
          Conectando ao Firebase...
        </Text>
      </View>
    );
  }

  let ContentComponent;

  if (showLoadingAnimation) {
    ContentComponent = (
      <LoadingScreen onAnimationFinish={() => setShowLoadingAnimation(false)} />
    );
  } else if (user) {
    switch (currentScreen) {
      case SCREENS.NEW_HABIT:
        ContentComponent = (
          <NewHabitScreen navigate={navigate} user={user} />
        );
        break;

      case SCREENS.PROGRESSION:
        ContentComponent = (
          <ProgressionScreen
            route={{ params: routeParams }}
            navigate={navigate}
            user={user}
            onProgressChange={(dateKey, data) => {
              setDailyProgress((prev) => ({
                ...prev,
                [dateKey]: data, // { percent, doneIds }
              }));
            }}
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
            progressByDate={dailyProgress}
          />
        );
        break;
    }
  } else {
    switch (currentScreen) {
      case SCREENS.LOGIN:
        ContentComponent = (
          <LoginScreen navigate={navigate} onLoginSuccess={handleAuthSuccess} />
        );
        break;

      case SCREENS.REGISTER:
        ContentComponent = (
          <RegisterScreen navigate={navigate} onRegisterSuccess={handleAuthSuccess} />
        );
        break;

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
