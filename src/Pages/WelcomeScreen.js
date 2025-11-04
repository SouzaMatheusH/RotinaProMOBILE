// src/pages/WelcomeScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { globalStyles, COLORS } from '../Styles/theme';
import PrimaryButton from '../Components/PrimaryButton';
import { FontAwesome } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { completeGoogleSignIn } from '../Config/firebaseAuth';

// Tela de Boas-Vindas com Login Google.
const WelcomeScreen = ({ navigate }) => {
  const goToLogin = () => navigate('Login');
  const goToRegister = () => navigate('Register');

  // === DADOS DE CONFIGURAÇÃO CRÍTICOS ===
  // 1. TROQUE ISSO PELA SUA REAL ANDROID CLIENT ID!
  const ANDROID_CLIENT_ID = 'SEU_ANDROID_CLIENT_ID_REAL'; 
  // 2. ISSO É SUA WEB CLIENT ID (expoClientId)
  const WEB_CLIENT_ID = '934347804663-2ejai3cv74ad16c5pm9s3hdn14pb9crv.apps.googleusercontent.com';

  // CHAMA O HOOK DO EXPO AQUI
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: WEB_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  // MONITOR A RESPOSTA DO GOOGLE (AuthSession)
  useEffect(() => {
    if (response?.type === 'success' && response.params?.id_token) {
      const idToken = response.params.id_token;
      
      // Conclui o login no Firebase usando o token
      completeGoogleSignIn(idToken)
        .then((result) => {
          // Navegação é automática via App.js
          console.log('Login Google bem-sucedido. O listener do Firebase está navegando.', result.user.email);
        })
        .catch((error) => {
          console.error('Erro ao concluir login Firebase com token:', error);
          Alert.alert('Erro', 'Falha ao autenticar com Google. Tente novamente.');
        });
    } else if (response?.type === 'cancel') {
       console.log('Login Google cancelado.');
    }
  }, [response]);
  
  // FUNÇÃO DO BOTÃO: APENAS CHAMA O PROMPT DO HOOK
  const handleGoogleLogin = async () => {
    promptAsync();
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.logoArea}>
        <Text style={styles.logoText}>ROTINA PRO</Text>
      </View>
      <View style={globalStyles.authContainer}>
        <Text style={globalStyles.title}>Olá, seja bem-vindo!</Text>
        <Text style={globalStyles.subtitle}>
          Seja bem-vindo ao melhor app de desenvolvimento de hábitos
          que você já usou!
        </Text>
        <PrimaryButton title="Login" onPress={goToLogin}
          style={styles.buttonSpacing} />
        <TouchableOpacity onPress={goToRegister}
          style={styles.buttonSpacing} >
          <Text style={globalStyles.linkText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... (Resto dos estilos, que não mudaram)
const styles = StyleSheet.create({
  logoArea: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.TERTIARY,
    letterSpacing: 3,
  },
  buttonSpacing: {
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  socialContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  socialText: {
    color: COLORS.TEXT_LIGHT,
    marginBottom: 20,
  },
  socialIcons: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-around',
  },
  iconButton: {
    padding: 10,
    backgroundColor: COLORS.SECONDARY + '20',
    borderRadius: 50,
  },
});

export default WelcomeScreen;