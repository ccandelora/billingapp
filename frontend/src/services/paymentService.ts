import axios from 'axios';
import { Payment, PaymentFormData } from '../types/Payment';

const API_URL = 'http://localhost:3001/api';

export const paymentService = {
    getAllPayments: async (): Promise<Payment[]> => {
        const response = await axios.get(`${API_URL}/payments`);
        return response.data;
    },

    createPayment: async (payment: PaymentFormData): Promise<Payment> => {
        const response = await axios.post(`${API_URL}/payments`, payment);
        return response.data;
    }
}; 