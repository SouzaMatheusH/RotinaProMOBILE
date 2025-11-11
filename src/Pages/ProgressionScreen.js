import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { COLORS } from '../Styles/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../Config/firebaseFirestore';

const WEEKDAY_PT = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado'
];

const ProgressionScreen = ({ route, navigate, onProgressChange }) => {
  const { dateISO, habits, dayIndex, savedProgress } = route.params;

  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(savedProgress?.percent || 0);

  useEffect(() => {
    const dailyHabits = (habits || []).filter(h => h.recurrence.includes(dayIndex));
    const withStatus = dailyHabits.map(h => ({
      ...h,
      done: savedProgress?.doneIds?.includes(h.id) || false,
    }));
    setTasks(withStatus);
  }, [habits, dayIndex, savedProgress]);

  const toggleTask = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTasks(updated);

    const completed = updated.filter(t => t.done).length;
    const percent = updated.length ? (completed / updated.length) * 100 : 0;
    setProgress(percent);

    const doneIds = updated.filter(t => t.done).map(t => t.id);
    onProgressChange(dateISO, { percent, doneIds });
  };

  const handleDeleteTask = async (id) => {
    try {
      const confirm = await new Promise((resolve) => {
        Alert.alert(
          'Excluir hábito',
          'Tem certeza que deseja excluir esta tarefa permanentemente?',
          [
            { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Excluir', style: 'destructive', onPress: () => resolve(true) },
          ],
          { cancelable: true }
        );
      });
      if (!confirm) return;

      await deleteDoc(doc(db, 'habits', id));

      const updatedTasks = tasks.filter(t => t.id !== id);
      setTasks(updatedTasks);

      const completed = updatedTasks.filter(t => t.done).length;
      const percent = updatedTasks.length ? (completed / updatedTasks.length) * 100 : 0;
      setProgress(percent);

      const doneIds = updatedTasks.filter(t => t.done).map(t => t.id);
      onProgressChange(dateISO, { percent, doneIds });

      console.log('Tarefa removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
    }
  };

  const dateObj = dateISO ? new Date(dateISO + 'T00:00:00') : new Date();
  const weekdayName = WEEKDAY_PT[dateObj.getDay()];
  const dayNumber = String(dateObj.getDate()).padStart(2, '0');
  const monthNumber = String(dateObj.getMonth() + 1).padStart(2, '0');
  const yearNumber = dateObj.getFullYear();
  const displayDateShort = `${dayNumber}/${monthNumber}`; // ex: 09/11

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigate('Home')}>
        <MaterialIcons name="arrow-back" size={28} color={COLORS.WHITE} />
      </TouchableOpacity>

      <Text style={styles.weekdayText}>{weekdayName}</Text>

      <Text style={styles.dateText}>{displayDateShort}</Text>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress}%`, backgroundColor: progress === 0 ? '#444' : COLORS.PRIMARY },
            ]}
          />
        </View>
      </View>

      <ScrollView style={styles.taskList}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskRow}>
            <TouchableOpacity style={styles.taskItem} onPress={() => toggleTask(task.id)}>
              <View style={[styles.checkbox, task.done && styles.checkboxChecked]}>
                {task.done && <MaterialIcons name="check" size={20} color={COLORS.WHITE} />}
              </View>
              <Text style={styles.taskText}>{task.name}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleDeleteTask(task.id)}>
              <MaterialIcons name="delete-outline" size={26} color="#ff5555" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND, padding: 20 },
  backButton: { marginTop: 30, marginBottom: 6 },
  weekdayText: {
    color: '#9CA3AF',
    fontSize: 12,
    textTransform: 'lowercase',
    marginBottom: 4,
  },
  dateText: { color: COLORS.WHITE, fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  progressBarContainer: { marginVertical: 15 },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#444',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  taskList: { marginTop: 10 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checkboxChecked: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  taskText: { color: COLORS.TEXT_LIGHT, fontSize: 16 },
});

export default ProgressionScreen;
