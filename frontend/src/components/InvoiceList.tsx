import React, { useEffect, useState, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Button, Chip, Typography, Box,
    TextField, InputAdornment, FormControl, InputLabel, Select,
    MenuItem, SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { Invoice } from '../types/Invoice';
import { invoiceService } from '../services/invoiceService';

const getStatusColor = (status: Invoice['paymentStatus']): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
        case 'PAID':
            return 'success';
        case 'PARTIALLY_PAID':
            return 'warning';
        case 'UNPAID':
            return 'error';
        case 'OVERPAID':
            return 'info';
        default:
            return 'default';
    }
};

export const InvoiceList: React.FC = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);

    const filterInvoices = useCallback(() => {
        let filtered = invoices;

        // Apply status filter
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(invoice => invoice.paymentStatus === statusFilter);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(invoice =>
                invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredInvoices(filtered);
    }, [invoices, searchTerm, statusFilter]);

    useEffect(() => {
        loadInvoices();
    }, []);

    useEffect(() => {
        filterInvoices();
    }, [filterInvoices]);

    const loadInvoices = async () => {
        try {
            const data = await invoiceService.getAllInvoices();
            setInvoices(data);
        } catch (error) {
            console.error('Error loading invoices:', error);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleStatusFilterChange = (event: SelectChangeEvent) => {
        setStatusFilter(event.target.value);
    };

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Invoices</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/invoices/new')}
                >
                    Create Invoice
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search invoices..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        label="Status"
                    >
                        <MenuItem value="ALL">All</MenuItem>
                        <MenuItem value="PAID">Paid</MenuItem>
                        <MenuItem value="PARTIALLY_PAID">Partially Paid</MenuItem>
                        <MenuItem value="UNPAID">Unpaid</MenuItem>
                        <MenuItem value="OVERPAID">Overpaid</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Invoice Number</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInvoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell>{invoice.invoiceNumber}</TableCell>
                                <TableCell>{invoice.customer.name}</TableCell>
                                <TableCell align="right">
                                    ${parseFloat(invoice.amount as unknown as string).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    {new Date(invoice.dueDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={invoice.paymentStatus}
                                        color={getStatusColor(invoice.paymentStatus)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}; 