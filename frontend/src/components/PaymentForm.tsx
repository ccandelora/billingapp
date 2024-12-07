import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField, Button, Container, Typography,
    MenuItem, FormControl, InputLabel, Select,
    SelectChangeEvent
} from '@mui/material';
import { Invoice } from '../types/Invoice';
import { PaymentFormData } from '../types/Payment';
import { invoiceService } from '../services/invoiceService';
import { paymentService } from '../services/paymentService';

export const PaymentForm: React.FC = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [formData, setFormData] = useState<PaymentFormData>({
        invoiceId: 0,
        amount: 0,
        paymentMethod: 'BANK_TRANSFER',
        reference: '',
        notes: ''
    });

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            const data = await invoiceService.getAllInvoices();
            setInvoices(data);
        } catch (error) {
            console.error('Error loading invoices:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await paymentService.createPayment(formData);
            navigate('/payments');
        } catch (error) {
            console.error('Error creating payment:', error);
        }
    };

    const handleSelectChange = (e: SelectChangeEvent<number>) => {
        setFormData(prev => ({
            ...prev,
            invoiceId: e.target.value as number
        }));
    };

    const handlePaymentMethodChange = (e: SelectChangeEvent) => {
        setFormData(prev => ({
            ...prev,
            paymentMethod: e.target.value as PaymentFormData['paymentMethod']
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" gutterBottom>
                Add Payment
            </Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Invoice</InputLabel>
                    <Select
                        name="invoiceId"
                        value={formData.invoiceId}
                        onChange={handleSelectChange}
                        required
                    >
                        {invoices.map(invoice => (
                            <MenuItem key={invoice.id} value={invoice.id}>
                                {invoice.invoiceNumber}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handlePaymentMethodChange}
                        required
                    >
                        <MenuItem value="CASH">Cash</MenuItem>
                        <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                        <MenuItem value="CHECK">Check</MenuItem>
                        <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
                        <MenuItem value="OTHER">Other</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Reference"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Notes"
                    name="notes"
                    multiline
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: '1rem' }}
                >
                    Add Payment
                </Button>
            </form>
        </Container>
    );
}; 