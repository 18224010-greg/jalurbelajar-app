# JalurBelajar (aplikasi mobile)

Aplikasi React Native (Expo) untuk siswa: masuk, memilih topik, mengerjakan kuis per modul,
menerima rekomendasi modul berikutnya, dan melihat progres. Tugas Besar TST × PWAM, kelompok PAWM TST Jaya (K02).

Backend: https://pawm-tst-jaya.stei.site/api
Repositori backend: https://github.com/18224010-greg/jalurbelajar

## Menjalankan

Syarat: Node.js (versi LTS) di laptop dan aplikasi **Expo Go** di HP (Play Store / App Store).
Laptop dan HP harus berada di jaringan Wi-Fi yang sama.

```
npm install
npx expo start
```

Pindai kode QR yang muncul dengan Expo Go (Android) atau kamera (iPhone).

Akun demo: `uji@mail.com` / `rahasia1` (atau daftar akun baru dari layar Daftar).

## Pengujian

```
npm test
```

## Struktur

```
App.js                     titik masuk: AuthProvider + navigasi
src/config.js              alamat API
src/services/ApiService.js semua pemanggilan API (token, timeout, penanganan error)
src/context/AuthContext.js sesi login (token disimpan di SecureStore)
src/navigation/            AuthStack, MainTabs (4 tab), LearnStack, RootNavigator
src/screens/               Login, Register, Home, Modules, ModuleDetail, Quiz, Result, Progress, Profile
src/components/            Button, TextField, Card, Chip, Screen, LoadingView/ErrorView/EmptyView
src/hooks/                 useAsync, useFocusReload
src/utils/                 validators, format
__tests__/                 uji unit (validasi, format, ApiService)
```

## Alur layar

Belum login: Login <-> Daftar. Sudah login: tab Beranda (rekomendasi), Belajar (Daftar Modul ->
Detail Modul -> Kuis -> Hasil), Progres, Profil (keluar).
