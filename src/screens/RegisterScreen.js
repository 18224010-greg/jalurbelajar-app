import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Screen from '../components/Screen';
import TextField from '../components/TextField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { validateRegisterForm } from '../utils/validators';
import { colors } from '../theme';

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));

  const onSubmit = async () => {
    const found = validateRegisterForm(form);
    setErrors(found);
    setSubmitError(null);
    if (Object.keys(found).length > 0) return;
    setLoading(true);
    try {
      await signUp(form.name, form.email, form.password);
    } catch (error) {
      setSubmitError(error.message);
      setLoading(false);
    }
  };

  return (
    <Screen>
      <TextField
        label="Nama"
        value={form.name}
        onChangeText={update('name')}
        autoCapitalize="words"
        placeholder="Nama lengkap"
        error={errors.name}
      />
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
        placeholder="Minimal 6 karakter"
        error={errors.password}
      />
      <TextField
        label="Konfirmasi password"
        value={form.confirmPassword}
        onChangeText={update('confirmPassword')}
        secureTextEntry
        placeholder="Ulangi password"
        error={errors.confirmPassword}
      />

      {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

      <Button title="Daftar" onPress={onSubmit} loading={loading} />
      <Button
        title="Sudah punya akun? Masuk"
        variant="secondary"
        onPress={() => navigation.goBack()}
        style={styles.second}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  submitError: {
    color: colors.danger,
    backgroundColor: colors.dangerBg,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  second: { marginTop: 12 },
});
