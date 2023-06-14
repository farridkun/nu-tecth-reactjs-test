import api from './api';

export const products = {
    list: async () => {
        try {
            const response = await api.get('/product');
            return response.data;
        } catch (error) {
            throw new Error('Data tidak ditemukan');
        }
    },
    add: async (products) => {
        try {
            const response = await api.post('/product', products);
            return response.data;
        } catch (error) {
            throw new Error('Ada kesalahan saat menambah produk');
        }
    },
    update: async (id, products) => {
        try {
            const response = await api.put('/product/' + id, products);
            return response.data;
        } catch (error) {
            throw new Error('Ada kesalahan saat updated produk');
        }
    },
    delete: async (id) => {
        try {
            const response = await api.delete('/product/' + id);
            return response.data;
        } catch (error) {
            throw new Error('Ada kesalahan saat menghapus produk');
        }
    }
};
