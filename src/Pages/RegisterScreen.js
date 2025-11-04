// src/pages/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { globalStyles } from '../Styles/theme';
import AuthInput from '../Components/AuthInput';
import PrimaryButton from '../Components/PrimaryButton'
import { createUserWithEmailAndPassword, getFriendlyErrorMessage } from '../Config/firebaseAuth';

/**
 * Tela de Cadastro de Conta com a lógica de autenticação Firebase. (Página 4 do PDF).
 */
const RegisterScreen = ({ navigate, onRegisterSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); // Seu design inclui campo de telefone
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Função de Cadastro
  const handleRegister = async () => {
    setError('');
    setIsLoading(true);

    // Validação básica
    if (!fullName || !email || !password) {
      setError('Email, senha e nome completo são obrigatórios.');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        setIsLoading(false);
        return;
    }

    try {
      // Chama a função de cadastro (real ou mockada)
      const userCredential = await createUserWithEmailAndPassword(email, password);

      // Se for bem-sucedido, chama o callback para atualizar o estado global
      onRegisterSuccess(userCredential.user);
      
      console.log('Cadastro bem-sucedido:', userCredential.user.email);

    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err.code || err.message);
      setError(friendlyMessage);
      console.error('Erro de Cadastro:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.authContainer}>
        <Text style={globalStyles.title}>Crie sua conta!</Text>
        <Text style={globalStyles.subtitle}>
          Comece sua rotina de sucesso hoje mesmo.
        </Text>
        
        {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

        <AuthInput
          placeholder="Nome Completo"
          value={fullName}
          onChangeText={setFullName}
        />
        
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
        
        <AuthInput
          placeholder="Telefone (Opcional)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <PrimaryButton
          title="Cadastre-se"
          onPress={handleRegister}
          loading={isLoading}
          disabled={!fullName || !email || !password}
          style={styles.registerButton}
        />
        
        {/* Link para Login */}
        <TouchableOpacity onPress={() => navigate('Login')}>
          <Text style={globalStyles.linkText}>Já tem uma conta? Faça Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  registerButton: {
    marginTop: 20,
    marginBottom: 20,
  }
});

export default RegisterScreen;