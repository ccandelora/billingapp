import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField, Button, Container, Typography,
    MenuItem, FormControl, InputLabel, Select,
    SelectChangeEvent
} from '@mui/material';
import { Customer } from '../types/Customer';
import { InvoiceFormData } from '../types/Invoice';
import { customerService } from '../services/customerService';
import { invoiceService } from '../services/invoiceService';

export const InvoiceForm: React.FC = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [formData, setFormData] = useState<InvoiceFormData>({
        customerId: 0,
        amount: 0,
        dueDate: new Date(),
        notes: ''
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await customerService.getAllCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Error loading customers:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await invoiceService.createInvoice(formData);
            navigate('/invoices');
        } catch (error) {
            console.error('Error creating invoice:', error);
        }
    };

    const handleSelectChange = (e: SelectChangeEvent<number>) => {
        setFormData(prev => ({
            ...prev,
            customerId: e.target.value as number
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
                Create New Invoice
            </Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Customer</InputLabel>
                    <Select
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleSelectChange}
                        required
                    >
                        {customers.map(customer => (
                            <MenuItem key={customer.id} value={customer.id}>
                                {customer.name}
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

                <TextField
                    fullWidth
                    margin="normal"
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate instanceof Date 
                        ? formData.dueDate.toISOString().split('T')[0]
                        : formData.dueDate}
                    onChange={handleInputChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    required
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Notes"
                    name="notes"
                    multiline
                    rows={4}
                    value={formData.notes || ''}
                    onChange={handleInputChange}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: '1rem' }}
                >
                    Create Invoice
                </Button>
            </form>
        </Container>
    );
}; 