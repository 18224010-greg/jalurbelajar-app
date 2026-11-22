import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import ApiService from '../services/ApiService';
import useAsync from '../hooks/useAsync';
import useFocusReload from '../hooks/useFocusReload';
import { formatDate } from '../utils/format';
import { colors } from '../theme';

export default function ProgressScreen() {
  const { data, loading, error, reload } = useAsync(() => ApiService.getProgress(), []);
  useFocusReload(reload);

  if (loading && !data) {
    return (
      <Screen scroll={false}>
        <LoadingView message="Memuat progres..." />
      </Screen>
    );
  }
  if (error && !data) {
    return (
      <Screen scroll={false}>
        <ErrorView message={error} onRetry={reload} />
      </Screen>
    );
  }

  const attempts = [...(data ? data.attempts : [])].reverse(); // terbaru di atas

  const header = (
    <View style={styles.summaryRow}>
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryValue}>{data.completed_modules.length}</Text>
        <Text style={styles.summaryLabel}>Modul tuntas</Text>
      </Card>
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryValue}>{data.average_percentage}%</Text>
        <Text style={styles.summaryLabel}>Rata-rata skor</Text>
      </Card>
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryValue}>{data.attempts.length}</Text>
        <Text style={styles.summaryLabel}>Kuis dikerjakan</Text>
      </Card>
    </View>
  );

  return (
    <Screen scroll={false}>
      <FlatList
        data={attempts}
        keyExtractor={(item) => String(item.attempt_id)}
        ListHeaderComponent={header}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
        ListEmptyComponent={
          <EmptyView
            title="Belum ada kuis yang dikerjakan"
            message="Kerjakan kuis pertamamu dari tab Belajar."
          />
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.title}>{item.module_title}</Text>
            <Text style={styles.meta}>
              {formatDate(item.created_at)} · Skor {item.score}/{item.total} ({item.percentage}%)
            </Text>
            <Text style={item.passed ? styles.passed : styles.failed}>
              {item.passed ? 'Lulus' : 'Belum lulus'}
            </Text>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  summaryCard: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  summaryValue: { fontSize: 22, fontWeight: '800', color: colors.primary },
  summaryLabel: { fontSize: 12, color: colors.muted, marginTop: 2, textAlign: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.muted, marginTop: 4 },
  passed: { fontSize: 14, fontWeight: '700', color: colors.success, marginTop: 4 },
  failed: { fontSize: 14, fontWeight: '700', color: colors.danger, marginTop: 4 },
});
