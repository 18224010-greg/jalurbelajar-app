import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Chip from '../components/Chip';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import ApiService from '../services/ApiService';
import useAsync from '../hooks/useAsync';
import { formatLevel, formatTopic } from '../utils/format';
import { colors } from '../theme';

const LEVELS = ['pemula', 'menengah', 'lanjut'];

export default function ModulesScreen({ navigation }) {
  const [topic, setTopic] = useState(null);
  const [level, setLevel] = useState(null);

  // Semua modul dimuat sekali; penyaringan dilakukan di perangkat.
  const { data, loading, error, reload } = useAsync(() => ApiService.getModules(), []);

  const topics = useMemo(() => [...new Set((data || []).map((m) => m.topic))].sort(), [data]);
  const filtered = useMemo(
    () =>
      (data || []).filter((m) => (!topic || m.topic === topic) && (!level || m.level === level)),
    [data, topic, level],
  );

  if (loading && !data) {
    return (
      <Screen scroll={false}>
        <LoadingView message="Memuat modul..." />
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

  const header = (
    <View>
      <Text style={styles.label}>Topik</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        <Chip label="Semua" selected={!topic} onPress={() => setTopic(null)} />
        {topics.map((t) => (
          <Chip key={t} label={formatTopic(t)} selected={t === topic} onPress={() => setTopic(t)} />
        ))}
      </ScrollView>
      <Text style={styles.label}>Level</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        <Chip label="Semua" selected={!level} onPress={() => setLevel(null)} />
        {LEVELS.map((l) => (
          <Chip key={l} label={formatLevel(l)} selected={l === level} onPress={() => setLevel(l)} />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Screen scroll={false}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={header}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
        ListEmptyComponent={
          <EmptyView
            title="Tidak ada modul"
            message="Tidak ada modul yang cocok dengan penyaring yang dipilih."
          />
        }
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('ModuleDetail', { module: item })}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>
              {formatTopic(item.topic)} · {formatLevel(item.level)}
            </Text>
            <Text style={styles.desc}>{item.description}</Text>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 6 },
  chips: { marginBottom: 12, flexGrow: 0 },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.primary, marginTop: 2, fontWeight: '600' },
  desc: { fontSize: 14, color: colors.muted, marginTop: 6 },
});
