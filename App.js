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
    // ESTADO OBRIGATÓRIO: user inicia como null, currentScreen como WELCOME
    const [user, setUser] = useState(null); 
    const [currentScreen, setCurrentScreen] = useState(SCREENS.WELCOME);
    const [isLoading, setIsLoading] = useState(true);
    const [showLoadingAnimation, setShowLoadingAnimation] = useState(false); 
    
    // Estado para os hábitos
    const [habits, setHabits] = useState([]); 

    // Efeito para MONITORAR o estado de autenticação do Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged((authUser) => {
            setUser(authUser);
            setIsLoading(false); 
            
            if (authUser) {
                // CORREÇÃO: Garante que, se o usuário estiver logado, vá para HOME, 
                // exceto se a animação estiver rodando (showLoadingAnimation)
                if (!showLoadingAnimation) {
                    setCurrentScreen(SCREENS.HOME);
                }
            } else {
                // Se deslogado, volta para a tela OBRIGATÓRIA de WELCOME
                setCurrentScreen(SCREENS.WELCOME);
            }
        });

        return () => unsubscribe(); 
    }, [showLoadingAnimation]); 

    const navigate = (screenName) => {
        setCurrentScreen(screenName);
    };

    const handleAuthSuccess = (authUser) => {
        // Ativa a tela de Loading após Login/Cadastro SUCESSO
        setShowLoadingAnimation(true);
    };

    /**
     * FUNÇÃO CORRIGIDA:
     * Ao receber o comando de Logout da HomeScreen, força a tela para WELCOME.
     * A mudança de estado do usuário (user=null) é feita pela signOut do Firebase.
     */
    const handleLogout = () => {
        setCurrentScreen(SCREENS.WELCOME);
    };

    const addNewHabit = (newHabit) => {
        const habitWithId = { ...newHabit, id: Date.now() };
        setHabits((prevHabits) => [...prevHabits, habitWithId]);
        // Confirma navegação de volta para a HOME
        navigate(SCREENS.HOME); 
    };

    // 1. Tela de Carregamento Inicial
    if (isLoading) {
        return (
            <View style={[globalStyles.container, styles.centerScreen]}>
                <Text style={{ color: COLORS.SECONDARY, fontSize: 20 }}>Conectando ao Firebase...</Text>
            </View>
        );
    }

    // 2. Logica de Roteamento
    let ContentComponent;

    if (showLoadingAnimation) {
        ContentComponent = (
            <LoadingScreen 
                onAnimationFinish={() => {
                    // Após 2s, desativa a animação e o useEffect leva para HOME
                    setShowLoadingAnimation(false);
                }}
            />
        );
    } else if (user) {
        // Roteamento para Usuário LOGADO
        switch (currentScreen) {
            case SCREENS.NEW_HABIT:
                ContentComponent = (
                    <NewHabitScreen 
                        navigate={navigate} 
                        onSave={addNewHabit} 
                    />
                );
                break;
            case SCREENS.HOME:
            default:
                ContentComponent = (
                    <HomeScreen 
                        user={user} 
                        onLogout={handleLogout} // Chama a função que reseta a tela
                        navigate={navigate}
                        habits={habits}
                    />
                );
                break;
        }
    } else {
        // Roteamento OBRIGATÓRIO para Usuário DESLOGADO
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
            case SCREENS.WELCOME:
            default:
                // TELA INICIAL
                ContentComponent = <WelcomeScreen navigate={navigate} />;
                break;
        }
    }

    return ContentComponent;
};

const styles = StyleSheet.create({
    centerScreen: {
        justifyContent: 'center', 
        alignItems: 'center' 
    }
});

export default App;