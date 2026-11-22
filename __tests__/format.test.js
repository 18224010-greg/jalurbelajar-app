import { formatTopic, formatLevel, formatDate } from '../src/utils/format';

test('formatTopic mengubah slug menjadi judul', () => {
  expect(formatTopic('bahasa-inggris')).toBe('Bahasa Inggris');
  expect(formatTopic('python')).toBe('Python');
  expect(formatTopic('')).toBe('');
});

test('formatLevel mengubah huruf pertama menjadi kapital', () => {
  expect(formatLevel('pemula')).toBe('Pemula');
  expect(formatLevel(undefined)).toBe('');
});

test('formatDate mengabaikan tanggal tidak valid', () => {
  expect(formatDate('bukan-tanggal')).toBe('');
  expect(formatDate('2026-11-22T08:00:00Z')).toMatch(/2026/);
});
