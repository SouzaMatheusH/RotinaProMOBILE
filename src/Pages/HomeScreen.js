// src/Pages/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { globalStyles, COLORS } from '../Styles/theme';
import PrimaryButton from '../Components/PrimaryButton';
import { signOut } from '../Config/firebaseAuth';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

const FRASES_API_URL = 'https://souzamatheush.github.io/FrasesAPI/frases.json';
const WEEK_DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const HomeScreen = ({ user, onLogout, navigate, habits }) => {
  const [insight, setInsight] = useState("Clique em 'Novo Insight' para uma dose de motivação!");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [allFrases, setAllFrases] = useState([]);

  useEffect(() => {
    const loadFrases = async () => {
      try {
        const response = await axios.get(FRASES_API_URL);
        setAllFrases(response.data);
      } catch (error) {
        console.error("Erro ao carregar frases da API:", error);
      }
    };
    loadFrases();
  }, []);

  const fetchNewInsight = () => {
    if (allFrases.length > 0) {
      setLoadingInsight(true);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * allFrases.length);
        const fraseObtida = allFrases[randomIndex];
        setInsight(`"${fraseObtida.frase}"\n\n- ${fraseObtida.autor}`);
        setLoadingInsight(false);
      }, 500);
    } else {
      setInsight("Carregando frases... Tente novamente em breve!");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onLogout();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // === Função principal do calendário ===
  const renderCalendarGrid = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0 = Janeiro, 10 = Novembro

    // Primeiro e último dia do mês atual
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Descobre o dia da semana em que o mês começa (0 = domingo)
    const startDayIndex = firstDayOfMonth.getDay();

    // Quantos quadrados o calendário precisa
    const totalDays = lastDayOfMonth.getDate();
    const totalCells = Math.ceil((startDayIndex + totalDays) / 7) * 7;

    const days = [];
    for (let i = 0; i < totalCells; i++) {
      const currentDate = new Date(year, month, i - startDayIndex + 1);
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = currentDate.toDateString() === today.toDateString();

      const dayIndex = currentDate.getDay();
      const isActiveDay = habits.some(habit => habit.recurrence.includes(dayIndex));

      let backgroundColor = COLORS.BACKGROUND;
      let borderColor = COLORS.TEXT_LIGHT + '25';
      let borderWidth = 1;

      if (isActiveDay && isCurrentMonth) {
        backgroundColor = COLORS.PRIMARY;
        borderColor = COLORS.PRIMARY;
      }

      if (isToday && isCurrentMonth) {
        borderColor = COLORS.WHITE;
        borderWidth = 2;
      }

      if (!isCurrentMonth) {
        backgroundColor = 'transparent';
        borderColor = 'transparent';
      }

      days.push(
        <View key={i} style={styles.calendarDayContainer}>
          <View style={[styles.calendarDaySquare, { backgroundColor, borderColor, borderWidth }]}>
            {isCurrentMonth && <Text style={styles.dayNumber}>{currentDate.getDate()}</Text>}
          </View>
        </View>
      );
    }

    return days;
  };

  const today = new Date();
  const currentMonthName = MONTH_NAMES[today.getMonth()];

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.title}>Hábitos</Text>
            <TouchableOpacity style={styles.newHabitButton} onPress={() => navigate('NewHabit')}>
              <Text style={styles.newHabitButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Mês atual */}
          <Text style={styles.monthTitle}>{currentMonthName}</Text>

          {/* Calendário */}
          <View style={styles.calendarContainer}>
            <View style={styles.weekDaysRow}>
              {WEEK_DAYS.map((day, index) => (
                <Text key={index} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>
            <View style={styles.calendarGrid}>{renderCalendarGrid()}</View>
          </View>

          {/* Insight + Botão */}
          <View style={styles.insightSection}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Insight do Dia</Text>
              <Text style={styles.cardContent}>{insight}</Text>
            </View>

            <PrimaryButton
              title={loadingInsight ? "Carregando..." : "Novo Insight"}
              onPress={fetchNewInsight}
              loading={loadingInsight}
              disabled={loadingInsight || allFrases.length === 0}
              style={styles.insightButton}
            />
          </View>

          {/* Botão de sair */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
            <MaterialIcons name="logout" size={20} color={COLORS.SECONDARY} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  content: {
    flex: 1,
    maxWidth: 420,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.WHITE,
  },
  newHabitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newHabitButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 24,
    fontWeight: 'bold',
  },
  monthTitle: {
    color: COLORS.TERTIARY,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  calendarContainer: {
    width: '100%',
    marginBottom: 40,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  weekDayText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    width: `${100 / 7}%`,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  calendarDayContainer: {
    width: `${100 / 7 - 1.5}%`,
    aspectRatio: 1,
    marginVertical: 3,
  },
  calendarDaySquare: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumber: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  insightSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.BACKGROUND + '80',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.SECONDARY + '50',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TERTIARY,
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 15,
    color: COLORS.TEXT_LIGHT,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  insightButton: {
    width: '100%',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.BACKGROUND,
    marginBottom: 60,
  },
  logoutButtonText: {
    color: COLORS.SECONDARY,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;