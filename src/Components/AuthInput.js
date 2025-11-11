import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { COLORS } from '../Styles/theme';


const AuthInput = ({ placeholder, value, onChangeText, secureTextEntry, keyboardType }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.TEXT_LIGHT + '70'} // 70 é a opacidade
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
};


const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.TEXT_LIGHT + '10', // Fundo transparente/escuro
    color: COLORS.WHITE,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.SECONDARY + '50', // Borda sutil
  },
});


export default AuthInput;