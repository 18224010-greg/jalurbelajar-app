import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import { colors } from '../theme';

export function LoadingView({ message = 'Memuat...' }) {
  return (
    <View style={styles.center} accessibilityLabel="Memuat">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorTitle}>Terjadi masalah</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <Button title="Coba lagi" onPress={onRetry} style={styles.retry} /> : null}
    </View>
  );
}

export function EmptyView({ title, message }) {
  return (
    <View style={styles.center}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  message: { color: colors.muted, textAlign: 'center', marginTop: 8, fontSize: 15 },
  errorTitle: { color: colors.danger, fontSize: 17, fontWeight: '700' },
  emptyTitle: { color: colors.text, fontSize: 17, fontWeight: '700', textAlign: 'center' },
  retry: { marginTop: 16, minWidth: 140 },
});
