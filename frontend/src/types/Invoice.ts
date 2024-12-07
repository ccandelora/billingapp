import { Customer } from './Customer';

export interface Invoice {
    id: number;
    customer: Customer;
    invoiceNumber: string;
    amount: number;
    paidAmount: number;
    paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERPAID';
    dueDate: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface InvoiceFormData {
    customerId: number;
    amount: number;
    dueDate: Date;
    notes?: string;
} 