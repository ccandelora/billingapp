import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Typography
} from '@mui/material';
import { Payment } from '../types/Payment';
import { paymentService } from '../services/paymentService';

export const PaymentList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            const data = await paymentService.getAllPayments();
            setPayments(data);
        } catch (error) {
            console.error('Error loading payments:', error);
        }
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Payments
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Invoice Number</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell>Payment Method</TableCell>
                            <TableCell>Reference</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{payment.invoice.invoiceNumber}</TableCell>
                                <TableCell align="right">
                                    ${payment.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>{payment.paymentMethod}</TableCell>
                                <TableCell>{payment.reference}</TableCell>
                                <TableCell>
                                    {new Date(payment.createdAt).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}; 