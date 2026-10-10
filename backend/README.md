# Backend RESTful API - Aplikasi Manajemen Tugas

Backend RESTful API untuk **Aplikasi Manajemen Tugas (Task Management Application)** dibangun menggunakan **Node.js** dan **Express.js** dengan menerapkan pola arsitektur **MVC (Model - View - Controller)**.

---

## 📁 Struktur Direktori (MVC Architecture)

```
backend/
├── controllers/
│   └── taskController.js   # Logika bisnis dan penanganan request/response
├── models/
│   └── taskModel.js        # Struktur data & operasi CRUD (In-memory database)
├── routes/
│   └── taskRoutes.js       # Definisi endpoint API untuk resource tugas
├── .env                    # Variabel environment (Port, dll.)
├── .env.example            # Contoh konfigurasi environment
├── index.js                # Server utama Express & konfigurasi middleware (CORS, JSON parser)
├── package.json            # Daftar dependensi dan scripts
└── README.md               # Dokumentasi API
```

---

## 🚀 Cara Menjalankan Server

### 1. Prasyarat
Pastikan komputer sudah terinstall **Node.js** (v16 ke atas) dan **npm**.

### 2. Instalasi Dependensi
Buka terminal di dalam folder `backend`:
```bash
cd backend
npm install
```

### 3. Menjalankan Server
Untuk mode pengembangan (auto-reload menggunakan nodemon):
```bash
npm run dev
```

Atau mode standar:
```bash
npm start
```

Server akan aktif di:
`http://localhost:5000`

---

## 🌐 Dokumentasi API (Endpoints)

Base URL: `http://localhost:5000/api/tasks`

| Method | Endpoint | Deskripsi | Query / Parameter |
|---|---|---|---|
| **GET** | `/` | Health check & info API | - |
| **GET** | `/api/tasks` | Mengambil seluruh daftar tugas | `?status=`, `?priority=`, `?search=` |
| **GET** | `/api/tasks/:id` | Mengambil detail 1 tugas berdasarkan ID | `id` (contoh: `/api/tasks/1`) |
| **POST** | `/api/tasks` | Menambahkan tugas baru | JSON Body |
| **PUT** | `/api/tasks/:id` | Memperbarui data tugas berdasarkan ID | `id` & JSON Body |
| **DELETE** | `/api/tasks/:id` | Menghapus tugas berdasarkan ID | `id` |

---

## 📝 Format Data & Contoh Request / Response

### 1. Struktur Objek Tugas
```json
{
  "id": 1,
  "title": "Menyelesaikan Tugas UTS Mopro",
  "description": "Membuat backend Express dan frontend mobile",
  "status": "pending",        // "pending" | "in-progress" | "completed"
  "priority": "high",         // "low" | "medium" | "high"
  "dueDate": "2026-10-25",    // format YYYY-MM-DD (opsional)
  "createdAt": "2026-10-10T11:00:00.000Z",
  "updatedAt": "2026-10-10T11:00:00.000Z"
}
```

---

### 2. POST `/api/tasks` (Tambah Tugas)
**Headers:**
`Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Belajar State Management Flutter",
  "description": "Mempelajari Provider / Riverpod / Bloc untuk integrasi API",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2026-10-30"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Tugas berhasil ditambahkan",
  "data": {
    "id": 4,
    "title": "Belajar State Management Flutter",
    "description": "Mempelajari Provider / Riverpod / Bloc untuk integrasi API",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2026-10-30",
    "createdAt": "2026-10-10T13:40:00.000Z",
    "updatedAt": "2026-10-10T13:40:00.000Z"
  }
}
```

---

### 3. GET `/api/tasks` (Filter & Search)
Contoh pemanggilan:
- Mengambil semua tugas: `http://localhost:5000/api/tasks`
- Filter tugas yang selesai: `http://localhost:5000/api/tasks?status=completed`
- Filter tugas prioritas tinggi: `http://localhost:5000/api/tasks?priority=high`
- Mencari tugas berdasarkan kata kunci: `http://localhost:5000/api/tasks?search=ui`

---

### 4. PUT `/api/tasks/:id` (Update Tugas)
**Headers:**
`Content-Type: application/json`

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Tugas berhasil diperbarui",
  "data": {
    "id": 2,
    "title": "Implementasi RESTful API Express.js",
    "description": "Membuat endpoint CRUD tugas dengan arsitektur MVC dan CORS",
    "status": "completed",
    "priority": "high",
    "dueDate": "2026-10-18",
    "createdAt": "2026-10-08T09:00:00.000Z",
    "updatedAt": "2026-10-10T13:42:00.000Z"
  }
}
```

---

### 5. DELETE `/api/tasks/:id` (Hapus Tugas)
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Tugas berhasil dihapus",
  "data": {
    "id": 3,
    "title": "Integrasi API ke Frontend Mobile"
  }
}
```

---

## 🔒 Konfigurasi CORS
Library `cors` sudah diaktifkan di `index.js`. Hal ini memastikan aplikasi frontend (baik Web browser seperti React/Vue mau pun aplikasi mobile seperti Flutter/React Native) dapat melakukan HTTP Request tanpa diblokir oleh CORS policy.

---

## 💡 Opsi Migrasi ke MongoDB & Mongoose
Jika di kemudian hari ingin beralih dari array in-memory ke database MongoDB:
1. Pasang mongoose:
   ```bash
   npm install mongoose
   ```
2. Hubungkan mongoose di `index.js`:
   ```javascript
   const mongoose = require('mongoose');
   mongoose.connect(process.env.MONGODB_URI)
     .then(() => console.log('Terhubung ke MongoDB'))
     .catch(err => console.error('Koneksi MongoDB gagal:', err));
   ```
3. Ubah `models/taskModel.js` menggunakan `mongoose.Schema`:
   ```javascript
   const mongoose = require('mongoose');
   const taskSchema = new mongoose.Schema({
     title: { type: String, required: true },
     description: { type: String, default: '' },
     status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
     priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
     dueDate: { type: String }
   }, { timestamps: true });
   module.exports = mongoose.model('Task', taskSchema);
   ```
