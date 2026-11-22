import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import TextField from '../components/TextField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm } from '../utils/validators';
import { colors } from '../theme';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));

  const onSubmit = async () => {
    const found = validateLoginForm(form);
    setErrors(found);
    setSubmitError(null);
    if (Object.keys(found).length > 0) return;
    setLoading(true);
    try {
      await signIn(form.email, form.password);
    } catch (error) {
      setSubmitError(error.message);
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.brand}>JalurBelajar</Text>
        <Text style={styles.tagline}>Belajar sesuai tingkat kemampuanmu</Text>
      </View>

      <TextField
        label="Email"
        value={form.email}
        onChangeText={update('email')}
        keyboardType="email-address"
        autoComplete="email"
        placeholder="nama@email.com"
        error={errors.email}
      />
      <TextField
        label="Password"
        value={form.password}
        onChangeText={update('password')}
        secureTextEntry
        autoComplete="password"
        placeholder="Password"
        error={errors.password}
      />

      {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

      <Button title="Masuk" onPress={onSubmit} loading={loading} />
      <Button
        title="Belum punya akun? Daftar"
        variant="secondary"
        onPress={() => navigation.navigate('Register')}
        style={styles.second}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginTop: 40, marginBottom: 32 },
  brand: { fontSize: 32, fontWeight: '800', color: colors.primary },
  tagline: { fontSize: 15, color: colors.muted, marginTop: 6 },
  submitError: {
    color: colors.danger,
    backgroundColor: colors.dangerBg,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  second: { marginTop: 12 },
});
