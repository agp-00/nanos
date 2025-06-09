import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
  }
});

// Cargar token si existe
const token = localStorage.getItem('auth_token');
if (token) {
  instance.defaults.headers.Authorization = `Bearer ${token}`;
}

export default instance;
