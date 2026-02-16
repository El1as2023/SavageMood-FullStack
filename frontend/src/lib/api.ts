import axios from 'axios';

// Створюємо екземпляр axios
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Адреса твого Go сервера
    headers: {
        'Content-Type': 'application/json',
    },
});

// Інтерцептор (перехоплювач): Додає токен до кожного запиту
api.interceptors.request.use((config) => {
    // Перевіряємо, чи ми на клієнті (бо Next.js може рендерити і на сервері)
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;