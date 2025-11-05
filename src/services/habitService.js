// src/services/habitService.js

import { getAuth } from 'firebase/auth'; 
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore'; 
import { db } from '../Config/firebaseConfig'; // Importa o Firestore inicializado

/**
 * Salva um novo hábito no Firestore, atrelado ao UID do usuário logado.
 * @param {object} habitData - O objeto do hábito (nome, recurrence, etc.).
 */
export async function saveNewHabitToFirestore(habitData) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Usuário não logado. Faça o login para salvar seu hábito.");
    }

    const habitToSave = {
        ...habitData,
        userId: user.uid, // CHAVE MESTRA: Garante a exclusividade do dado!
        createdAt: new Date(),
    };

    try {
        const habitosCollectionRef = collection(db, 'habitos');
        await addDoc(habitosCollectionRef, habitToSave);
        
    } catch (error) {
        console.error("Erro ao salvar hábito no Firestore:", error);
        throw new Error("Erro de Servidor: Não foi possível salvar o hábito.");
    }
}


/**
 * Cria uma inscrição em tempo real para buscar apenas os hábitos do usuário logado.
 * @param {string} userId - O UID do usuário logado.
 * @param {function} callback - Função que recebe a lista atualizada de hábitos.
 * @returns {function} - Função de 'unsubscribe' para limpar o listener.
 */
export function subscribeToUserHabits(userId, callback) {
    // Cria a query: Coleção 'habitos' ONDE o campo 'userId' é igual ao ID do usuário
    const habitsQuery = query(
        collection(db, 'habitos'),
        where("userId", "==", userId)
    );

    // onSnapshot: Cria um listener em tempo real
    const unsubscribe = onSnapshot(habitsQuery, (snapshot) => {
        const habitsList = [];
        snapshot.forEach((doc) => {
            habitsList.push({
                id: doc.id, 
                ...doc.data()
            });
        });
        callback(habitsList);
    }, (error) => {
        console.error("Erro no listener do Firestore:", error);
    });

    return unsubscribe;
}