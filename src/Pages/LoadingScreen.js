import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { globalStyles, COLORS } from '../Styles/theme'; 

const LoadingScreen = ({ onAnimationFinish }) => {
    // Array de valores animados para os 6 quadrados
    const animValues = useRef([...Array(6)].map(() => new Animated.Value(0))).current;

    const COLOR_SEQUENCE = [
        COLORS.PRIMARY,   
        COLORS.SECONDARY, 
        COLORS.TERTIARY,  
        COLORS.SECONDARY,
        COLORS.PRIMARY,
        '#222222',        
    ];
    
    // Cria uma sequência de animação para um ciclo (6 pulos)
    const createAnimationSequence = () => {
        const animations = animValues.map((animValue) => {
            return Animated.timing(animValue, {
                toValue: 1, 
                duration: 200, 
                easing: Easing.bezier(0.5, 0.0, 0.5, 1.5), 
                useNativeDriver: true,
            });
        });

        return Animated.sequence([
            // Stagger para fazer a animação sequencial
            Animated.stagger(100, animations),
            // Reseta a posição de todos
            Animated.parallel(animValues.map(animValue => 
                Animated.timing(animValue, {
                    toValue: 0, 
                    duration: 100, 
                    useNativeDriver: true,
                })
            )),
        ]);
    };

    useEffect(() => {
        const runAnimation = () => {
            Animated.sequence([
                createAnimationSequence(), // Ciclo 1
                createAnimationSequence(), // Ciclo 2
            ]).start(() => {
                onAnimationFinish(); // Chama após os 2 ciclos (aprox. 2s)
            });
        };

        runAnimation();
    }, [onAnimationFinish]); 

    const renderSquares = () => {
        return animValues.map((animValue, index) => {
            const translateY = animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20], 
            });
            
            const backgroundColor = COLOR_SEQUENCE[index]; 
            
            return (
                <Animated.View
                    key={index}
                    style={[
                        styles.square,
                        { backgroundColor: backgroundColor },
                        {
                            transform: [{ translateY }],
                            opacity: animValue.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [0.3, 1, 0.3], 
                            }),
                        }
                    ]}
                />
            );
        });
    };

    return (
        <View style={globalStyles.container}>
            <View style={styles.squaresContainer}>
                {renderSquares()}
            </View>
            <Text style={styles.text}>Um passo de cada vez...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    squaresContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        width: '80%', 
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    square: {
        width: 25,
        height: 25,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    text: {
        fontSize: 18,
        color: COLORS.TEXT_LIGHT,
        marginTop: 10,
        fontStyle: 'italic',
    },
});

export default LoadingScreen;