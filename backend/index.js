require("dotenv").config();
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// Middleware Konfigurasi
// ==========================================

// Mengaktifkan CORS agar API dapat diakses oleh frontend (React, Flutter, Android, dll.)
app.use(cors());

// Parsing JSON body dari incoming request
app.use(express.json());

// Parsing URL-encoded body
app.use(express.urlencoded({ extended: true }));

// Simple logger middleware untuk memantau request yang masuk
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// ==========================================
// Routing
// ==========================================

// Endpoint root / health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Selamat datang di RESTful API Aplikasi Manajemen Tugas",
    version: "1.0.0",
    endpoints: {
      getAllTasks: "GET /api/tasks",
      getTaskById: "GET /api/tasks/:id",
      createTask: "POST /api/tasks",
      updateTask: "PUT /api/tasks/:id",
      deleteTask: "DELETE /api/tasks/:id"
    }
  });
});

// Mounting routes untuk Task
app.use("/api/tasks", taskRoutes);

// ==========================================
// Error Handling Middleware
// ==========================================

// Handler untuk route yang tidak ditemukan (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint '${req.originalUrl}' dengan method '${req.method}' tidak ditemukan.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan internal pada server",
    error: err.message
  });
});

// ==========================================
// Menjalankan Server
// ==========================================
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Server Aplikasi Manajemen Tugas Aktif!`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` API Endpoint: http://localhost:${PORT}/api/tasks`);
  console.log(`===============================================`);
});

module.exports = app;
