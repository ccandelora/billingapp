import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Payment } from "../entities/Payment";
import { Invoice } from "../entities/Invoice";

export class PaymentController {
    static getAllPayments = async (req: Request, res: Response): Promise<void> => {
        try {
            const paymentRepository = AppDataSource.getRepository(Payment);
            const payments = await paymentRepository.find({
                relations: ['invoice', 'invoice.customer']
            });
            res.json(payments);
        } catch (error) {
            res.status(500).json({ message: "Error fetching payments", error });
        }
    };

    static createPayment = async (req: Request, res: Response): Promise<void> => {
        try {
            const { invoiceId, amount, paymentMethod, reference, notes } = req.body;
            
            const invoiceRepository = AppDataSource.getRepository(Invoice);
            const invoice = await invoiceRepository.findOne({
                where: { id: invoiceId },
                relations: ['payments']
            });

            if (!invoice) {
                res.status(404).json({ message: "Invoice not found" });
                return;
            }

            const paymentRepository = AppDataSource.getRepository(Payment);
            const payment = new Payment();
            payment.invoice = invoice;
            payment.amount = amount;
            payment.paymentMethod = paymentMethod;
            payment.reference = reference;
            payment.notes = notes;

            await paymentRepository.save(payment);

            // Update invoice paid amount and status
            invoice.paidAmount = (invoice.payments || [])
                .reduce((sum, p) => sum + Number(p.amount), 0) + Number(amount);

            if (invoice.paidAmount >= invoice.amount) {
                invoice.paymentStatus = invoice.paidAmount > invoice.amount ? 'OVERPAID' : 'PAID';
            } else {
                invoice.paymentStatus = invoice.paidAmount > 0 ? 'PARTIALLY_PAID' : 'UNPAID';
            }

            await invoiceRepository.save(invoice);

            res.status(201).json(payment);
        } catch (error) {
            res.status(500).json({ message: "Error creating payment", error });
        }
    };
} 