# Aplikasi Mobile Manajemen Tugas (React Native - Expo)

Aplikasi mobile **Manajemen Tugas (Task Management)** dibangun menggunakan **React Native** dengan **Expo** dan **React Navigation**. Terhubung langsung dengan Backend RESTful API Express.js untuk operasi CRUD (Create, Read, Update, Delete) secara real-time.

---

## 📁 Struktur Direktori Proyek

```
mobile/
├── assets/                    # Aset gambar, ikon, dan splash screen
├── src/
│   ├── components/            # Komponen UI modular & reusable
│   │   ├── TaskCard.js        # Kartu tugas (checkbox selesai, badge prioritas, aksi edit/hapus)
│   │   ├── SearchBar.js       # Input pencarian instan
│   │   ├── FilterBar.js       # Filter chip status (Semua, Tertunda, Diproses, Selesai)
│   │   ├── HeaderStats.js     # Ringkasan statistik jumlah tugas di bagian atas
│   │   └── EmptyState.js      # Tampilan saat daftar tugas kosong
│   ├── constants/
│   │   └── theme.js           # Desain token (Warna, Palet, Font & Shadow)
│   ├── screens/               # Layar utama aplikasi
│   │   ├── HomeScreen.js      # Halaman utama: Daftar tugas, filter, pencarian, & FAB
│   │   └── TaskFormScreen.js  # Halaman formulir Tambah & Edit tugas
│   └── services/              # Komunikasi API Backend
│       ├── api.js             # Konfigurasi Axios & Base URL (http://localhost:3000)
│       └── taskService.js     # Fungsi CRUD (getAll, getById, create, update, delete)
├── App.js                     # Root aplikasi & konfigurasi React Navigation Stack
├── app.json                   # Konfigurasi proyek Expo
├── babel.config.js            # Konfigurasi Babel preset Expo
├── package.json               # Daftar pustaka & skrip eksekusi
└── README.md                  # Panduan penggunaan
```

---

## 🚀 Cara Menjalankan Aplikasi Mobile

### 1. Masuk ke Direktori Mobile & Install Dependensi
Buka terminal dan jalankan:
```bash
cd mobile
npm install
```

### 2. Menjalankan Server Expo
```bash
npx expo start
# atau
npm start
```

Setelah server Expo berjalan:
- Tekan **`a`** untuk membuka di **Android Emulator**
- Tekan **`i`** untuk membuka di **iOS Simulator**
- Tekan **`w`** untuk membuka di **Web Browser**
- Atau scan QR code menggunakan aplikasi **Expo Go** di HP fisik Anda.

---

## ⚙️ Konfigurasi URL Backend ([`src/services/api.js`](file:///c:/Users/AdiSK/OneDrive/Documents/UTS%20Mopro%20Individu/mobile/src/services/api.js))

File `api.js` saat ini diarahkan ke:
```javascript
export const BASE_URL = 'http://localhost:3000';
```

> [!IMPORTANT]
> **Petunjuk Menghubungkan ke Perangkat / Emulator:**
> 1. **Web Browser (Expo Web):** Gunakan `http://localhost:3000` (atau `http://localhost:5000` sesuai port backend Anda).
> 2. **Android Emulator:** Android emulator menganggap `localhost` sebagai sistem internalnya sendiri. Ganti URL menjadi:
>    ```javascript
>    export const BASE_URL = 'http://10.0.2.2:5000'; // atau port 3000
>    ```
> 3. **HP Fisik (Expo Go):** HP dan laptop/PC harus berada dalam satu jaringan Wi-Fi yang sama. Gunakan IP lokal laptop Anda (cek via `ipconfig` di Windows):
>    ```javascript
>    export const BASE_URL = 'http://192.168.1.XX:5000'; // sesuaikan IP laptop Anda
>    ```

---

## ✨ Fitur-Fitur Utama Aplikasi

1. **Halaman Daftar Tugas (Home)**:
   - **Statistik Cepat**: Melihat total tugas, jumlah tugas tertunda, dan tugas yang telah diselesaikan.
   - **Pencarian Real-time**: Mencari tugas berdasarkan judul atau isi deskripsi.
   - **Filter Status**: Menyaring tugas berdasarkan status (*Semua*, *Tertunda*, *Diproses*, *Selesai*).
   - **Checkbox Selesai Cepat**: Menandai tugas selesai secara langsung dari kartu tugas.
   - **Hapus Tugas**: Dilengkapi dialog konfirmasi untuk mencegah ketidaksengajaan.
   - **Pull to Refresh**: Tarik ke bawah layar untuk memuat ulang data dari backend.
   - **Floating Action Button (FAB)**: Tombol melayang untuk menambah tugas baru secara cepat.

2. **Halaman Tambah & Edit Tugas (TaskForm)**:
   - **Mode Dinamis**: Otomatis mendeteksi mode Tambah baru atau Edit tugas yang dipilih.
   - **Validasi Input**: Peringatan jika judul tugas belum diisi.
   - **Pilihan Prioritas Interaktif**: Tombol pilihan visual untuk *Rendah (Low)*, *Sedang (Medium)*, dan *Tinggi (High)*.
   - **Pilihan Status Interaktif**: *Tertunda*, *Diproses*, dan *Selesai*.
   - **Pintasan Tanggal Cepat**: Tombol *Hari Ini*, *Besok*, dan *+1 Minggu* untuk menentukan tenggat waktu tanpa mengetik manual.
