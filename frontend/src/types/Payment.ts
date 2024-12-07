import { Invoice } from './Invoice';

export interface Payment {
    id: number;
    invoice: Invoice;
    amount: number;
    paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHECK' | 'CREDIT_CARD' | 'OTHER';
    reference?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaymentFormData {
    invoiceId: number;
    amount: number;
    paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHECK' | 'CREDIT_CARD' | 'OTHER';
    reference?: string;
    notes?: string;
} 