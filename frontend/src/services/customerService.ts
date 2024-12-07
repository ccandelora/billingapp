import axios from 'axios';
import { Customer, CustomerFormData } from '../types/Customer';

const API_URL = 'http://localhost:3001/api';

export const customerService = {
    getAllCustomers: async (): Promise<Customer[]> => {
        const response = await axios.get(`${API_URL}/customers`);
        return response.data;
    },

    getCustomerById: async (id: number): Promise<Customer> => {
        const response = await axios.get(`${API_URL}/customers/${id}`);
        return response.data;
    },

    createCustomer: async (customer: CustomerFormData): Promise<Customer> => {
        const response = await axios.post(`${API_URL}/customers`, customer);
        return response.data;
    },

    updateCustomer: async (id: number, customer: CustomerFormData): Promise<Customer> => {
        const response = await axios.put(`${API_URL}/customers/${id}`, customer);
        return response.data;
    },

    deleteCustomer: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/customers/${id}`);
    }
}; 