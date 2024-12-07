import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Typography, Grid, Paper, Card, CardContent,
    FormControl, InputLabel, Select, MenuItem,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Invoice } from '../types/Invoice';
import { Payment } from '../types/Payment';
import { invoiceService } from '../services/invoiceService';
import { paymentService } from '../services/paymentService';

interface MonthlyStats {
    month: string;
    invoiced: number;
    received: number;
    pending: number;
}

export const Reports: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [timeFrame, setTimeFrame] = useState('last6months');
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
    const [topCustomers, setTopCustomers] = useState<{ name: string; total: number }[]>([]);

    const formatMonth = useCallback((monthStr: string) => {
        const date = new Date(monthStr + '-01');
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }, []);

    const getMonthRange = useCallback(() => {
        const months = [];
        const today = new Date();
        const monthCount = timeFrame === 'last12months' ? 12 : 6;

        for (let i = monthCount - 1; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push(date.toISOString().substring(0, 7));
        }

        return months;
    }, [timeFrame]);

    const calculateMonthlyStats = useCallback((invoices: Invoice[], payments: Payment[]): MonthlyStats[] => {
        const months = getMonthRange();
        return months.map(month => {
            const monthInvoices = invoices.filter(inv => 
                new Date(inv.createdAt).toISOString().startsWith(month)
            );
            const monthPayments = payments.filter(pay => 
                new Date(pay.createdAt).toISOString().startsWith(month)
            );

            const invoiced = monthInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
            const received = monthPayments.reduce((sum, pay) => sum + Number(pay.amount), 0);

            return {
                month: formatMonth(month),
                invoiced,
                received,
                pending: invoiced - received
            };
        });
    }, [getMonthRange, formatMonth]);

    const calculateTopCustomers = useCallback((invoices: Invoice[], payments: Payment[]) => {
        const customerTotals = new Map<string, number>();

        invoices.forEach(invoice => {
            const current = customerTotals.get(invoice.customer.name) || 0;
            customerTotals.set(invoice.customer.name, current + Number(invoice.amount));
        });

        return Array.from(customerTotals.entries())
            .map(([name, total]) => ({ name, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
    }, []);

    const loadReportData = useCallback(async () => {
        try {
            setLoading(true);
            const [invoices, payments] = await Promise.all([
                invoiceService.getAllInvoices(),
                paymentService.getAllPayments()
            ]);

            const stats = calculateMonthlyStats(invoices, payments);
            const customers = calculateTopCustomers(invoices, payments);

            setMonthlyStats(stats);
            setTopCustomers(customers);
        } catch (error) {
            console.error('Error loading report data:', error);
        } finally {
            setLoading(false);
        }
    }, [calculateMonthlyStats, calculateTopCustomers]);

    useEffect(() => {
        loadReportData();
    }, [loadReportData]);

    const handleTimeFrameChange = (event: SelectChangeEvent) => {
        setTimeFrame(event.target.value);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Financial Reports</Typography>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Time Frame</InputLabel>
                    <Select
                        value={timeFrame}
                        label="Time Frame"
                        onChange={handleTimeFrameChange}
                    >
                        <MenuItem value="last6months">Last 6 Months</MenuItem>
                        <MenuItem value="last12months">Last 12 Months</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Monthly Revenue Overview
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Month</TableCell>
                                        <TableCell align="right">Invoiced</TableCell>
                                        <TableCell align="right">Received</TableCell>
                                        <TableCell align="right">Pending</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {monthlyStats.map((stat) => (
                                        <TableRow key={stat.month}>
                                            <TableCell>{stat.month}</TableCell>
                                            <TableCell align="right">
                                                ${stat.invoiced.toFixed(2)}
                                            </TableCell>
                                            <TableCell align="right">
                                                ${stat.received.toFixed(2)}
                                            </TableCell>
                                            <TableCell align="right">
                                                ${stat.pending.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Top Customers by Revenue
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Customer</TableCell>
                                        <TableCell align="right">Total Revenue</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topCustomers.map((customer) => (
                                        <TableRow key={customer.name}>
                                            <TableCell>{customer.name}</TableCell>
                                            <TableCell align="right">
                                                ${customer.total.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}; 