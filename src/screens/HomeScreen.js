import { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Chip from '../components/Chip';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/ApiService';
import useAsync from '../hooks/useAsync';
import useFocusReload from '../hooks/useFocusReload';
import { formatLevel, formatTopic } from '../utils/format';
import { colors } from '../theme';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [topic, setTopic] = useState(null);

  const modules = useAsync(() => ApiService.getModules(), []);
  const topics = useMemo(
    () => [...new Set((modules.data || []).map((m) => m.topic))].sort(),
    [modules.data],
  );

  useEffect(() => {
    if (!topic && topics.length > 0) setTopic(topics[0]);
  }, [topic, topics]);

  const recs = useAsync(
    () => (topic ? ApiService.getRecommendations(topic) : Promise.resolve([])),
    [topic],
  );
  useFocusReload(recs.reload);

  const openModule = (module) =>
    navigation.navigate('Belajar', { screen: 'ModuleDetail', params: { module }, initial: false });

  const refreshing = modules.loading || recs.loading;
  const onRefresh = () => {
    modules.reload();
    recs.reload();
  };

  let body;
  if (modules.loading && !modules.data) {
    body = <LoadingView message="Memuat topik..." />;
  } else if (modules.error) {
    body = <ErrorView message={modules.error} onRetry={modules.reload} />;
  } else if (topics.length === 0) {
    body = <EmptyView title="Belum ada materi" message="Materi belajar belum tersedia." />;
  } else {
    body = (
      <>
        <Text style={styles.section}>Pilih topik</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {topics.map((t) => (
            <Chip key={t} label={formatTopic(t)} selected={t === topic} onPress={() => setTopic(t)} />
          ))}
        </ScrollView>

        <Text style={styles.section}>Rekomendasi untukmu</Text>
        {recs.loading ? (
          <LoadingView message="Menyusun rekomendasi..." />
        ) : recs.error ? (
          <ErrorView message={recs.error} onRetry={recs.reload} />
        ) : recs.data && recs.data.length > 0 ? (
          recs.data.map((r) => (
            <Card key={r.module.id} onPress={() => openModule(r.module)}>
              <Text style={styles.cardTitle}>{r.module.title}</Text>
              <Text style={styles.cardMeta}>{formatLevel(r.module.level)}</Text>
              <Text style={styles.reason}>{r.reason}</Text>
            </Card>
          ))
        ) : (
          <EmptyView
            title="Semua modul sudah tuntas"
            message="Kamu telah menyelesaikan semua modul pada topik ini."
          />
        )}
      </>
    );
  }

  return (
    <Screen
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.greetingBox}>
        <Text style={styles.greeting}>Halo, {user ? user.name : ''}</Text>
        <Text style={styles.subtitle}>Lanjutkan jalur belajarmu hari ini.</Text>
      </View>
      {body}
    </Screen>
  );
}

const styles = StyleSheet.create({
  greetingBox: { marginBottom: 16 },
  greeting: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 15, color: colors.muted, marginTop: 4 },
  section: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 8, marginBottom: 10 },
  chips: { marginBottom: 8, flexGrow: 0 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardMeta: { fontSize: 13, color: colors.primary, marginTop: 2, fontWeight: '600' },
  reason: { fontSize: 14, color: colors.muted, marginTop: 6 },
});
