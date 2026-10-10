import axios from 'axios';

/**
 * Konfigurasi Base URL Backend:
 * - Default: 'http://localhost:3000' (sesuai permintaan tugas)
 * 
 * Catatan untuk Pengujian Mobile:
 * - Jika menggunakan Android Emulator: ganti 'localhost' dengan '10.0.2.2' (misal: 'http://10.0.2.2:3000' atau 'http://10.0.2.2:5000')
 * - Jika menggunakan HP Fisik (Expo Go): gunakan IP lokal laptop/PC (misal: 'http://192.168.1.XX:3000')
 * - Jika backend berjalan di port 5000: sesuaikan port menjadi 5000
 */
export const BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor untuk mempermudah debugging request
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk penanganan response dan error
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `[API Error ${error.response.status}]`,
        error.response.data?.message || error.message
      );
    } else if (error.request) {
      console.error('[API Network Error] Tidak dapat terhubung ke server backend');
    } else {
      console.error('[API Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
