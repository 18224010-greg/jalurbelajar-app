import {
  validateEmail,
  validatePassword,
  validateName,
  validateLoginForm,
  validateRegisterForm,
} from '../src/utils/validators';

describe('validateEmail', () => {
  test('menolak email kosong', () => {
    expect(validateEmail('')).toBe('Email wajib diisi');
    expect(validateEmail('   ')).toBe('Email wajib diisi');
  });
  test('menolak format salah', () => {
    expect(validateEmail('abc')).toBe('Format email tidak valid');
    expect(validateEmail('a@b')).toBe('Format email tidak valid');
  });
  test('menerima email valid', () => {
    expect(validateEmail('uji@mail.com')).toBeNull();
    expect(validateEmail('  uji@mail.com  ')).toBeNull();
  });
});

describe('validatePassword', () => {
  test('menolak kosong dan terlalu pendek', () => {
    expect(validatePassword('')).toBe('Password wajib diisi');
    expect(validatePassword('12345')).toBe('Password minimal 6 karakter');
  });
  test('menolak lebih dari 72 karakter', () => {
    expect(validatePassword('a'.repeat(73))).toBe('Password maksimal 72 karakter');
  });
  test('menerima password valid', () => {
    expect(validatePassword('rahasia1')).toBeNull();
  });
});

describe('validateName', () => {
  test('menolak nama kosong atau terlalu panjang', () => {
    expect(validateName(' ')).toBe('Nama wajib diisi');
    expect(validateName('a'.repeat(61))).toBe('Nama maksimal 60 karakter');
  });
  test('menerima nama valid', () => {
    expect(validateName('Eddy')).toBeNull();
  });
});

describe('validateLoginForm', () => {
  test('mengumpulkan semua kesalahan', () => {
    expect(validateLoginForm({ email: '', password: '' })).toEqual({
      email: 'Email wajib diisi',
      password: 'Password wajib diisi',
    });
  });
  test('kosong bila valid', () => {
    expect(validateLoginForm({ email: 'a@b.co', password: 'x' })).toEqual({});
  });
});

describe('validateRegisterForm', () => {
  const valid = { name: 'Uji', email: 'uji@mail.com', password: 'rahasia1', confirmPassword: 'rahasia1' };
  test('valid', () => {
    expect(validateRegisterForm(valid)).toEqual({});
  });
  test('konfirmasi password harus sama', () => {
    expect(validateRegisterForm({ ...valid, confirmPassword: 'beda' })).toEqual({
      confirmPassword: 'Konfirmasi password tidak sama',
    });
  });
  test('semua kolom kosong', () => {
    const errors = validateRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'name', 'password']);
  });
});
