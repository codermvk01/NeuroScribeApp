import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';

const questions = [
  "Do you experience memory loss?",
  "Do you have difficulty concentrating?",
  "Do you feel disoriented sometimes?",
];

export default function GuestQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (answer: boolean) => {
    setAnswers(prev => ({ ...prev, [currentStep]: answer }));
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('Questionnaire submitted');
      // Navigate or handle submission
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
      <Text style={styles.question}>{questions[currentStep]}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.button, styles.radio]} onPress={() => handleAnswer(true)}>
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.radio]} onPress={() => handleAnswer(false)}>
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.light.primaryLighter,
    flex: 1,
    justifyContent: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
    marginBottom: 30,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: Colors.light.background,
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 30,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  radio: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  buttonText: {
    color: Colors.light.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});
