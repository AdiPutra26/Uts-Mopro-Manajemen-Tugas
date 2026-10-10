import api from './api';

/**
 * Service untuk operasi CRUD data Tugas
 */
export const taskService = {
  /**
   * Mengambil semua daftar tugas dengan parameter pencarian / filter opsional
   * @param {Object} params - { status, priority, search }
   */
  getAllTasks: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  /**
   * Mengambil detail satu tugas berdasarkan ID
   * @param {number|string} id
   */
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Menambahkan tugas baru
   * @param {Object} taskData - { title, description, status, priority, dueDate }
   */
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  /**
   * Memperbarui data tugas berdasarkan ID
   * @param {number|string} id
   * @param {Object} taskData - Field yang ingin diperbarui
   */
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  /**
   * Menghapus tugas berdasarkan ID
   * @param {number|string} id
   */
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Mengubah status tugas secara cepat (toggle selesai / belum selesai)
   * @param {Object} task
   */
  toggleComplete: async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const response = await api.put(`/tasks/${task.id}`, { status: newStatus });
    return response.data;
  },
};

export default taskService;
