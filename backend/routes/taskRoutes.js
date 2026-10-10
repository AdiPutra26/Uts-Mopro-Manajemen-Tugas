const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

/**
 * Routing untuk resource Tugas (/api/tasks)
 */

// Mengambil semua data tugas & membuat tugas baru
router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

// Mengambil detail tugas, update tugas, & hapus tugas berdasarkan ID
router
  .route("/:id")
  .get(taskController.getTaskById)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
