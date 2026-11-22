import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

// Kerangka dasar layar. scroll=false dipakai bila isi layar berupa FlatList sendiri.
export default function Screen({ children, scroll = true, refreshControl, style }) {
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, style]}
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.fill, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16 },
  fill: { flex: 1 },
});
