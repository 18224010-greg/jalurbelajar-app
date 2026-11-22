import { Alert, StyleSheet, Text } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const confirmSignOut = () =>
    Alert.alert('Keluar', 'Yakin ingin keluar dari akunmu?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: signOut },
    ]);

  return (
    <Screen>
      <Card>
        <Text style={styles.label}>Nama</Text>
        <Text style={styles.value}>{user ? user.name : '-'}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user ? user.email : '-'}</Text>
        <Text style={styles.label}>ID siswa</Text>
        <Text style={styles.value}>{user ? user.student_id : '-'}</Text>
      </Card>
      <Button title="Keluar" variant="secondary" onPress={confirmSignOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, color: colors.muted, marginTop: 8 },
  value: { fontSize: 16, color: colors.text, fontWeight: '600' },
});
