import axios from 'axios';
import { Invoice, InvoiceFormData } from '../types/Invoice';

const API_URL = 'http://localhost:3001/api';

export const invoiceService = {
    getAllInvoices: async (): Promise<Invoice[]> => {
        const response = await axios.get(`${API_URL}/invoices`);
        return response.data;
    },

    createInvoice: async (invoice: InvoiceFormData): Promise<Invoice> => {
        const response = await axios.post(`${API_URL}/invoices`, invoice);
        return response.data;
    },

    updateInvoiceStatus: async (id: number, paymentStatus: Invoice['paymentStatus']): Promise<Invoice> => {
        const response = await axios.patch(`${API_URL}/invoices/${id}/status`, { paymentStatus });
        return response.data;
    }
}; 