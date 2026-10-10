/**
 * Task Model (In-Memory Database)
 * 
 * Model ini mengelola data tugas menggunakan array memori lokal.
 * Struktur data tugas:
 * - id: number | string
 * - title: string (wajib)
 * - description: string
 * - status: 'pending' | 'in-progress' | 'completed' (default: 'pending')
 * - priority: 'low' | 'medium' | 'high' (default: 'medium')
 * - recurrence: 'none' | 'daily' | 'weekly' | 'monthly' (default: 'none') -> Tugas Berjadwal
 * - dueDate: string (format YYYY-MM-DD)
 * - createdAt: string (ISO timestamp)
 * - updatedAt: string (ISO timestamp)
 */

// Data awal (Seed data) untuk kemudahan pengujian
let tasks = [
  {
    id: 1,
    title: "Menyelesaikan Desain UI Mobile",
    description: "Membuat mockup halaman dashboard dan detail tugas di Figma",
    status: "completed",
    priority: "high",
    recurrence: "none",
    dueDate: "2026-10-15",
    createdAt: new Date("2026-10-01T08:00:00Z").toISOString(),
    updatedAt: new Date("2026-10-05T10:30:00Z").toISOString()
  },
  {
    id: 2,
    title: "Implementasi RESTful API Express.js",
    description: "Membuat endpoint CRUD tugas dengan arsitektur MVC dan CORS",
    status: "in-progress",
    priority: "high",
    recurrence: "daily",
    dueDate: "2026-10-18",
    createdAt: new Date("2026-10-08T09:00:00Z").toISOString(),
    updatedAt: new Date("2026-10-10T14:20:00Z").toISOString()
  },
  {
    id: 3,
    title: "Memberi Makan Kucing & Peliharaan",
    description: "Memberikan makanan bergizi dan air bersih untuk kucing kesayangan",
    status: "pending",
    priority: "high",
    recurrence: "daily",
    dueDate: "2026-10-11",
    createdAt: new Date("2026-10-10T07:00:00Z").toISOString(),
    updatedAt: new Date("2026-10-10T07:00:00Z").toISOString()
  },
  {
    id: 4,
    title: "Review Progres Belajar Santri Coding",
    description: "Evaluasi rutin pemahaman materi Express, React Native, dan database mingguan",
    status: "in-progress",
    priority: "medium",
    recurrence: "weekly",
    dueDate: "2026-10-17",
    createdAt: new Date("2026-10-10T11:00:00Z").toISOString(),
    updatedAt: new Date("2026-10-10T11:00:00Z").toISOString()
  }
];

// Counter ID otomatis
let nextId = 5;

const TaskModel = {
  /**
   * Mengambil semua tugas dengan filter opsional (status, priority, search query, recurrence)
   */
  findAll: (filter = {}) => {
    let result = [...tasks];

    if (filter.status) {
      result = result.filter(
        (t) => t.status.toLowerCase() === filter.status.toLowerCase()
      );
    }

    if (filter.priority) {
      result = result.filter(
        (t) => t.priority.toLowerCase() === filter.priority.toLowerCase()
      );
    }

    if (filter.recurrence) {
      result = result.filter(
        (t) => (t.recurrence || "none").toLowerCase() === filter.recurrence.toLowerCase()
      );
    }

    if (filter.search) {
      const query = filter.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    return result;
  },

  /**
   * Mengambil tugas berdasarkan ID
   */
  findById: (id) => {
    const numericId = Number(id);
    return tasks.find((t) => t.id === numericId) || null;
  },

  /**
   * Membuat tugas baru
   */
  create: (taskData) => {
    const now = new Date().toISOString();
    const newTask = {
      id: nextId++,
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : "",
      status: taskData.status || "pending",
      priority: taskData.priority || "medium",
      recurrence: taskData.recurrence || "none",
      dueDate: taskData.dueDate || null,
      createdAt: now,
      updatedAt: now
    };

    tasks.push(newTask);
    return newTask;
  },

  /**
   * Memperbarui tugas berdasarkan ID
   */
  update: (id, updateData) => {
    const numericId = Number(id);
    const index = tasks.findIndex((t) => t.id === numericId);

    if (index === -1) {
      return null;
    }

    const currentTask = tasks[index];
    const updatedTask = {
      ...currentTask,
      title: updateData.title !== undefined ? updateData.title.trim() : currentTask.title,
      description:
        updateData.description !== undefined ? updateData.description.trim() : currentTask.description,
      status: updateData.status !== undefined ? updateData.status : currentTask.status,
      priority: updateData.priority !== undefined ? updateData.priority : currentTask.priority,
      recurrence: updateData.recurrence !== undefined ? updateData.recurrence : (currentTask.recurrence || "none"),
      dueDate: updateData.dueDate !== undefined ? updateData.dueDate : currentTask.dueDate,
      updatedAt: new Date().toISOString()
    };

    tasks[index] = updatedTask;
    return updatedTask;
  },

  /**
   * Menghapus tugas berdasarkan ID
   */
  delete: (id) => {
    const numericId = Number(id);
    const index = tasks.findIndex((t) => t.id === numericId);

    if (index === -1) {
      return null;
    }

    const deletedTask = tasks.splice(index, 1)[0];
    return deletedTask;
  },

  /**
   * Mengosongkan data (opsional, untuk testing)
   */
  reset: () => {
    tasks = [];
    nextId = 1;
  }
};

module.exports = TaskModel;
