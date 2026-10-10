const TaskModel = require("../models/taskModel");

/**
 * Task Controller
 * Menghubungkan request HTTP dengan model dan mengembalikan response JSON
 */
const taskController = {
  /**
   * @route   GET /api/tasks
   * @desc    Mengambil semua data tugas (bisa difilter via query: ?status=completed&priority=high&search=desain&recurrence=daily)
   */
  getAllTasks: (req, res) => {
    try {
      const { status, priority, search, recurrence } = req.query;
      const tasks = TaskModel.findAll({ status, priority, search, recurrence });

      return res.status(200).json({
        success: true,
        message: "Berhasil mengambil data tugas",
        total: tasks.length,
        data: tasks
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error.message
      });
    }
  },

  /**
   * @route   GET /api/tasks/:id
   * @desc    Mengambil detail satu tugas berdasarkan ID
   */
  getTaskById: (req, res) => {
    try {
      const { id } = req.params;
      const task = TaskModel.findById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Tugas dengan ID ${id} tidak ditemukan`
        });
      }

      return res.status(200).json({
        success: true,
        message: "Berhasil mengambil detail tugas",
        data: task
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error.message
      });
    }
  },

  /**
   * @route   POST /api/tasks
   * @desc    Membuat tugas baru (mendukung jadwal berulang: recurrence)
   */
  createTask: (req, res) => {
    try {
      const { title, description, status, priority, recurrence, dueDate } = req.body;

      // Validasi input wajib
      if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Field 'title' wajib diisi dan tidak boleh kosong"
        });
      }

      // Validasi opsi status
      const validStatuses = ["pending", "in-progress", "completed"];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Nilai 'status' tidak valid. Pilihan yang tersedia: ${validStatuses.join(", ")}`
        });
      }

      // Validasi opsi priority
      const validPriorities = ["low", "medium", "high"];
      if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: `Nilai 'priority' tidak valid. Pilihan yang tersedia: ${validPriorities.join(", ")}`
        });
      }

      // Validasi opsi recurrence (Jadwal Berulang)
      const validRecurrences = ["none", "daily", "weekly", "monthly"];
      if (recurrence && !validRecurrences.includes(recurrence)) {
        return res.status(400).json({
          success: false,
          message: `Nilai 'recurrence' tidak valid. Pilihan yang tersedia: ${validRecurrences.join(", ")}`
        });
      }

      const newTask = TaskModel.create({
        title,
        description,
        status,
        priority,
        recurrence: recurrence || "none",
        dueDate
      });

      return res.status(201).json({
        success: true,
        message: "Tugas berhasil ditambahkan",
        data: newTask
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error.message
      });
    }
  },

  /**
   * @route   PUT /api/tasks/:id
   * @desc    Memperbarui tugas yang sudah ada berdasarkan ID
   */
  updateTask: (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, status, priority, recurrence, dueDate } = req.body;

      // Cek apakah data tugas ada
      const existingTask = TaskModel.findById(id);
      if (!existingTask) {
        return res.status(404).json({
          success: false,
          message: `Tugas dengan ID ${id} tidak ditemukan`
        });
      }

      // Validasi input jika title diubah
      if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
        return res.status(400).json({
          success: false,
          message: "Field 'title' tidak boleh bernilai kosong"
        });
      }

      // Validasi opsi status jika diubah
      const validStatuses = ["pending", "in-progress", "completed"];
      if (status !== undefined && !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Nilai 'status' tidak valid. Pilihan yang tersedia: ${validStatuses.join(", ")}`
        });
      }

      // Validasi opsi priority jika diubah
      const validPriorities = ["low", "medium", "high"];
      if (priority !== undefined && !validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: `Nilai 'priority' tidak valid. Pilihan yang tersedia: ${validPriorities.join(", ")}`
        });
      }

      // Validasi opsi recurrence jika diubah
      const validRecurrences = ["none", "daily", "weekly", "monthly"];
      if (recurrence !== undefined && !validRecurrences.includes(recurrence)) {
        return res.status(400).json({
          success: false,
          message: `Nilai 'recurrence' tidak valid. Pilihan yang tersedia: ${validRecurrences.join(", ")}`
        });
      }

      const updatedTask = TaskModel.update(id, {
        title,
        description,
        status,
        priority,
        recurrence,
        dueDate
      });

      return res.status(200).json({
        success: true,
        message: "Tugas berhasil diperbarui",
        data: updatedTask
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error.message
      });
    }
  },

  /**
   * @route   DELETE /api/tasks/:id
   * @desc    Menghapus tugas berdasarkan ID
   */
  deleteTask: (req, res) => {
    try {
      const { id } = req.params;
      const deletedTask = TaskModel.delete(id);

      if (!deletedTask) {
        return res.status(404).json({
          success: false,
          message: `Tugas dengan ID ${id} tidak ditemukan`
        });
      }

      return res.status(200).json({
        success: true,
        message: "Tugas berhasil dihapus",
        data: deletedTask
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error.message
      });
    }
  }
};

module.exports = taskController;
