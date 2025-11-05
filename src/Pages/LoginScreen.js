// src/pages/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { globalStyles, COLORS } from '../Styles/theme';
import AuthInput from '../Components/AuthInput';
import PrimaryButton from '../Components/PrimaryButton';
import { signInWithEmailAndPassword, getFriendlyErrorMessage } from '../Config/firebaseAuth';

/**
 * Tela de Login com a lógica de autenticação Firebase. (Página 3 do PDF).
 */
const LoginScreen = ({ navigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Função de Login
  const handleLogin = async () => {
    setError('');
    setIsLoading(true);

    // Validação básica
    if (!email || !password) {
      setError('Preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    try {
      // Chama a função de login (real ou mockada)
      const userCredential = await signInWithEmailAndPassword(email, password);
      
      // Se for bem-sucedido, chama o callback para atualizar o estado global
      onLoginSuccess(userCredential.user);
      
      console.log('Login bem-sucedido:', userCredential.user.email);

    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err.code || err.message);
      setError(friendlyMessage);
      console.error('Erro de Login:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.authContainer}>
        <Text style={globalStyles.title}>Bem-vindo de volta!</Text>
        <Text style={globalStyles.subtitle}>
          Faça o login para continuar
        </Text>
        
        {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

        <AuthInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        
        <AuthInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        {/* Opções (Lembrar de mim e Esqueceu a senha?) */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionText}>Lembre de mim</Text>
          <TouchableOpacity>
            <Text style={globalStyles.linkText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        <PrimaryButton
          title="Login"
          onPress={handleLogin}
          loading={isLoading}
          disabled={!email || !password}
          style={styles.loginButton}
        />

        {/* Link para Cadastro */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Não tem uma conta?</Text>
          <TouchableOpacity onPress={() => navigate('Register')}>
            <Text style={globalStyles.linkText}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  optionText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 14,
  },
  loginButton: {
    marginTop: 20,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
    marginRight: 10,
  }
});

export default LoginScreen;
