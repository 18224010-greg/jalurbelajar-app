import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import { ErrorView, LoadingView } from '../components/StateViews';
import ApiService from '../services/ApiService';
import useAsync from '../hooks/useAsync';
import { colors } from '../theme';

export default function QuizScreen({ route, navigation }) {
  const { module } = route.params;
  const { data: quiz, loading, error, reload } = useAsync(() => ApiService.getQuiz(module.id), [module.id]);
  const [answers, setAnswers] = useState({}); // { questionId: indexJawaban }
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  if (loading) {
    return (
      <Screen scroll={false}>
        <LoadingView message="Memuat kuis..." />
      </Screen>
    );
  }
  if (error) {
    return (
      <Screen scroll={false}>
        <ErrorView message={error} onRetry={reload} />
      </Screen>
    );
  }

  const total = quiz.questions.length;
  const answered = Object.keys(answers).length;
  const complete = answered === total;

  const onSubmit = async () => {
    if (!complete) {
      setSubmitError(`Jawab semua pertanyaan dulu (${answered}/${total} terjawab).`);
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const payload = quiz.questions.map((q) => ({
        question_id: q.id,
        answer_index: answers[q.id],
      }));
      const result = await ApiService.submitQuiz(quiz.id, payload);
      navigation.replace('Result', { module, quiz, answers, result });
    } catch (e) {
      setSubmitError(e.message);
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.heading}>{quiz.title}</Text>
      <Text style={styles.progress}>
        {answered} dari {total} pertanyaan terjawab
      </Text>

      {quiz.questions.map((q, index) => (
        <Card key={q.id}>
          <Text style={styles.question}>
            {index + 1}. {q.text}
          </Text>
          {q.options.map((option, optionIndex) => {
            const selected = answers[q.id] === optionIndex;
            return (
              <Pressable
                key={optionIndex}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setAnswers((a) => ({ ...a, [q.id]: optionIndex }))}
                style={[styles.option, selected && styles.optionSelected]}
              >
                <View style={[styles.radio, selected && styles.radioSelected]} />
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            );
          })}
        </Card>
      ))}

      {submitError ? <Text style={styles.error}>{submitError}</Text> : null}
      <Button title="Kirim jawaban" onPress={onSubmit} loading={submitting} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: '800', color: colors.text },
  progress: { fontSize: 14, color: colors.muted, marginTop: 4, marginBottom: 12 },
  question: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: '#EAF2FF' },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.muted,
    marginRight: 10,
  },
  radioSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  optionText: { flex: 1, fontSize: 15, color: colors.text },
  error: {
    color: colors.danger,
    backgroundColor: colors.dangerBg,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
});
