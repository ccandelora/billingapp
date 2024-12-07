import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Invoice } from "../entities/Invoice";
import { Customer } from "../entities/Customer";

export class InvoiceController {
    static generateInvoiceNumber = async (): Promise<string> => {
        const year = new Date().getFullYear();
        const invoiceRepository = AppDataSource.getRepository(Invoice);
        const count = await invoiceRepository.count();
        return `INV-${year}-${(count + 1).toString().padStart(4, '0')}`;
    };

    static getAllInvoices = async (req: Request, res: Response): Promise<void> => {
        try {
            const invoiceRepository = AppDataSource.getRepository(Invoice);
            const invoices = await invoiceRepository.find({
                relations: ['customer']
            });
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ message: "Error fetching invoices", error });
        }
    };

    static createInvoice = async (req: Request, res: Response): Promise<void> => {
        try {
            const { customerId, amount, dueDate, notes } = req.body;
            const customerRepository = AppDataSource.getRepository(Customer);
            const customer = await customerRepository.findOneBy({ id: customerId });
            
            if (!customer) {
                res.status(404).json({ message: "Customer not found" });
                return;
            }

            const invoiceRepository = AppDataSource.getRepository(Invoice);
            const invoice = new Invoice();
            invoice.customer = customer;
            invoice.invoiceNumber = await InvoiceController.generateInvoiceNumber();
            invoice.amount = amount;
            invoice.dueDate = dueDate;
            invoice.notes = notes;
            invoice.paymentStatus = 'UNPAID';
            invoice.paidAmount = 0;

            const savedInvoice = await invoiceRepository.save(invoice);
            res.status(201).json(savedInvoice);
        } catch (error) {
            res.status(500).json({ message: "Error creating invoice", error });
        }
    };

    static updateInvoiceStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { paymentStatus } = req.body;
            const invoiceRepository = AppDataSource.getRepository(Invoice);
            const invoice = await invoiceRepository.findOneBy({ id: parseInt(req.params.id) });
            
            if (!invoice) {
                res.status(404).json({ message: "Invoice not found" });
                return;
            }

            invoice.paymentStatus = paymentStatus;
            const updatedInvoice = await invoiceRepository.save(invoice);
            res.json(updatedInvoice);
        } catch (error) {
            res.status(500).json({ message: "Error updating invoice status", error });
        }
    };
} 