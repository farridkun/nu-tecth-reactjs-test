import { removeAccessToken } from '../utils/LocalStorage';
import api from './api';

export const auth = {
    login: async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            return response.data;
        } catch (error) {
            throw new Error('Email atau password salah');
        }
    },
    register: async (name, email, password) => {
        try {
            const response = await api.post('/login', { name, email, password });
            return response.data;
        } catch (error) {
            throw new Error('Email atau password salah');
        }
    },
    logout: () => {
        removeAccessToken();
    }
};
