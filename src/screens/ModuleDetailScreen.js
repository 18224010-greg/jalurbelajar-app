import { StyleSheet, Text } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import { formatLevel, formatTopic } from '../utils/format';
import { colors } from '../theme';

export default function ModuleDetailScreen({ route, navigation }) {
  const { module } = route.params;
  return (
    <Screen>
      <Card>
        <Text style={styles.title}>{module.title}</Text>
        <Text style={styles.meta}>
          {formatTopic(module.topic)} · Level {formatLevel(module.level)}
        </Text>
        <Text style={styles.desc}>{module.description}</Text>
      </Card>
      <Text style={styles.hint}>
        Kerjakan kuis modul ini. Kamu dinyatakan lulus bila skornya 70% atau lebih, dan kuis boleh
        diulang kapan saja.
      </Text>
      <Button title="Mulai kuis" onPress={() => navigation.navigate('Quiz', { module })} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  meta: { fontSize: 14, color: colors.primary, marginTop: 4, fontWeight: '600' },
  desc: { fontSize: 15, color: colors.text, marginTop: 12, lineHeight: 22 },
  hint: { fontSize: 14, color: colors.muted, marginVertical: 12, lineHeight: 20 },
});
