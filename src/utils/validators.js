const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function validateEmail(value) {
  const email = (value || '').trim();
  if (!email) return 'Email wajib diisi';
  if (!EMAIL_PATTERN.test(email)) return 'Format email tidak valid';
  return null;
}

export function validatePassword(value) {
  if (!value) return 'Password wajib diisi';
  if (value.length < 6) return 'Password minimal 6 karakter';
  if (value.length > 72) return 'Password maksimal 72 karakter';
  return null;
}

export function validateName(value) {
  const name = (value || '').trim();
  if (!name) return 'Nama wajib diisi';
  if (name.length > 60) return 'Nama maksimal 60 karakter';
  return null;
}

// Mengembalikan objek { field: pesan }. Objek kosong berarti semua valid.
export function validateLoginForm({ email, password }) {
  const errors = {};
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  if (!password) errors.password = 'Password wajib diisi';
  return errors;
}

export function validateRegisterForm({ name, email, password, confirmPassword }) {
  const errors = {};
  const nameError = validateName(name);
  if (nameError) errors.name = nameError;
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;
  else if (password !== confirmPassword) errors.confirmPassword = 'Konfirmasi password tidak sama';
  return errors;
}
