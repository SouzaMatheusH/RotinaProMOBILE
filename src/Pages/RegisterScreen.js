import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../Styles/theme';
import AuthInput from '../Components/AuthInput';
import PrimaryButton from '../Components/PrimaryButton';
import { createUserWithEmailAndPassword } from '../Config/firebaseAuth';

const RegisterScreen = ({ navigate, onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(email, password);
      onRegisterSuccess();
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Comece sua rotina de sucesso hoje mesmo.</Text>

          <AuthInput placeholder="Nome Completo" value={name} onChangeText={setName} />
          <AuthInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <AuthInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
          <AuthInput placeholder="Telefone (Opcional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <PrimaryButton
            title="Cadastre-se"
            onPress={handleRegister}
            loading={loading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigate('Login')}>
              <Text style={styles.footerLink}>Faça Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    color: COLORS.WHITE,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
    marginBottom: 30,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: {
    color: COLORS.TEXT_LIGHT,
  },
  footerLink: {
    color: COLORS.SECONDARY,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
