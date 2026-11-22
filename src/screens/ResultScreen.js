import { StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors } from '../theme';

export default function ResultScreen({ route, navigation }) {
  const { module, quiz, answers, result } = route.params;
  const correctById = Object.fromEntries(result.results.map((r) => [r.question_id, r.correct]));

  return (
    <Screen>
      <View style={[styles.banner, result.passed ? styles.pass : styles.fail]}>
        <Text style={styles.percent}>{result.percentage}%</Text>
        <Text style={styles.verdict}>{result.passed ? 'Lulus' : 'Belum lulus'}</Text>
        <Text style={styles.score}>
          Benar {result.score} dari {result.total} pertanyaan
        </Text>
      </View>

      <Text style={styles.section}>Rincian jawaban</Text>
      {quiz.questions.map((q, index) => {
        const correct = correctById[q.id];
        return (
          <Card key={q.id}>
            <Text style={styles.question}>
              {index + 1}. {q.text}
            </Text>
            <Text style={styles.yourAnswer}>Jawabanmu: {q.options[answers[q.id]]}</Text>
            <Text style={correct ? styles.correct : styles.wrong}>
              {correct ? 'Benar' : 'Salah'}
            </Text>
          </Card>
        );
      })}

      <Button
        title="Coba lagi"
        variant="secondary"
        onPress={() => navigation.replace('Quiz', { module })}
      />
      <Button
        title="Kembali ke daftar modul"
        onPress={() => navigation.popToTop()}
        style={styles.second}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: { borderRadius: 14, padding: 20, alignItems: 'center', marginBottom: 16 },
  pass: { backgroundColor: colors.successBg },
  fail: { backgroundColor: colors.dangerBg },
  percent: { fontSize: 44, fontWeight: '800', color: colors.text },
  verdict: { fontSize: 20, fontWeight: '700', color: colors.text, marginTop: 2 },
  score: { fontSize: 15, color: colors.muted, marginTop: 6 },
  section: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 10 },
  question: { fontSize: 15, fontWeight: '600', color: colors.text },
  yourAnswer: { fontSize: 14, color: colors.muted, marginTop: 6 },
  correct: { fontSize: 14, fontWeight: '700', color: colors.success, marginTop: 4 },
  wrong: { fontSize: 14, fontWeight: '700', color: colors.danger, marginTop: 4 },
  second: { marginTop: 12 },
});
