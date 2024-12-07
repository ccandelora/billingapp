import { Tag } from './Tag';
import { Invoice } from './Invoice';

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    company?: string;
    notes?: string;
    tags: Tag[];
    invoices: Invoice[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CustomerFormData {
    name: string;
    email: string;
    phone: string;
    company?: string;
    notes?: string;
    tags: Tag[];
} 