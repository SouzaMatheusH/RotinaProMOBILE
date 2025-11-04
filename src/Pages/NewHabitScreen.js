// src/Pages/NewHabitScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { globalStyles, COLORS } from '../Styles/theme';
import { MaterialIcons } from '@expo/vector-icons';
import PrimaryButton from '../Components/PrimaryButton'; 

const DAYS_OF_WEEK = [
    { name: 'Domingo', index: 0 },
    { name: 'Segunda-feira', index: 1 },
    { name: 'Terça-feira', index: 2 },
    { name: 'Quarta-feira', index: 3 },
    { name: 'Quinta-feira', index: 4 },
    { name: 'Sexta-feira', index: 5 },
    { name: 'Sábado', index: 6 },
];

const NewHabitScreen = ({ navigate, onSave }) => {
    const [commitment, setCommitment] = useState('');
    const [recurrence, setRecurrence] = useState([]);

    const toggleDayRecurrence = (dayIndex) => {
        setRecurrence((prevRecurrence) => {
            if (prevRecurrence.includes(dayIndex)) {
                return prevRecurrence.filter(i => i !== dayIndex);
            } else {
                return [...prevRecurrence, dayIndex];
            }
        });
    };

    const handleConfirm = () => {
        if (!commitment.trim() || recurrence.length === 0) {
            console.warn("Preencha o comprometimento e selecione pelo menos um dia.");
            return;
        }

        const newHabit = {
            name: commitment.trim(),
            recurrence: recurrence.sort((a, b) => a - b), 
        };

        // Chama a função onSave (que salva e navega no App.js)
        onSave(newHabit); 
    };

    const RecurrenceCheckbox = ({ dayName, dayIndex, isChecked, onPress }) => (
        <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
            <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                {isChecked && <MaterialIcons name="check" size={20} color={COLORS.WHITE} />}
            </View>
            <Text style={styles.checkboxLabel}>{dayName}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={globalStyles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <View style={styles.header}>
                    {/* CORREÇÃO: Usa a string literal 'Home' para voltar */}
                    <TouchableOpacity onPress={() => navigate('Home')}>
                        <MaterialIcons name="arrow-back" size={28} color={COLORS.WHITE} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Criar hábito</Text>
                </View>

                <Text style={styles.sectionTitle}>Qual seu comprometimento?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Exercícios, dormir bem, etc..."
                    placeholderTextColor={COLORS.TEXT_LIGHT + '70'}
                    value={commitment}
                    onChangeText={setCommitment}
                />
                
                <Text style={styles.sectionTitle}>Qual a recorrência?</Text>
                <View style={styles.recurrenceContainer}>
                    {DAYS_OF_WEEK.map((day) => (
                        <RecurrenceCheckbox
                            key={day.index}
                            dayName={day.name}
                            dayIndex={day.index}
                            isChecked={recurrence.includes(day.index)}
                            onPress={() => toggleDayRecurrence(day.index)}
                        />
                    ))}
                </View>

                <PrimaryButton
                    title="Confirmar"
                    onPress={handleConfirm}
                    style={styles.confirmButton}
                    disabled={!commitment.trim() || recurrence.length === 0} 
                />

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingTop: 40,
        paddingHorizontal: 25,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.WHITE,
        marginLeft: 15,
    },
    sectionTitle: {
        width: '100%',
        maxWidth: 400,
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.WHITE,
        marginTop: 20,
        marginBottom: 10,
    },
    input: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: COLORS.TEXT_LIGHT + '10', 
        color: COLORS.WHITE,
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: COLORS.SECONDARY + '50', 
    },
    recurrenceContainer: {
        width: '100%',
        maxWidth: 400,
        marginTop: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        width: '100%',
    },
    checkbox: {
        width: 25,
        height: 25,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: COLORS.SECONDARY,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: 'transparent',
    },
    checkboxChecked: {
        backgroundColor: COLORS.SUCCESS || '#10B981', 
        borderColor: COLORS.SUCCESS || '#10B981',
    },
    checkboxLabel: {
        fontSize: 16,
        color: COLORS.TEXT_LIGHT,
        fontWeight: '500',
    },
    confirmButton: {
        marginTop: 40,
        marginBottom: 40,
        maxWidth: 400,
        backgroundColor: COLORS.SUCCESS || '#10B981', 
    },
});

export default NewHabitScreen;
