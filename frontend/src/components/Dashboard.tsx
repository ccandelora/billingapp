import React, { useEffect, useState } from 'react';
import {
    Grid, Paper, Typography, Box,
    CircularProgress, Card, CardContent,
    List, ListItem, ListItemText
} from '@mui/material';
import {
    AttachMoney as MoneyIcon,
    People as PeopleIcon,
    Receipt as ReceiptIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { Customer } from '../types/Customer';
import { Invoice } from '../types/Invoice';
import { Payment } from '../types/Payment';
import { customerService } from '../services/customerService';
import { invoiceService } from '../services/invoiceService';
import { paymentService } from '../services/paymentService';

interface DashboardStats {
    totalCustomers: number;
    totalInvoices: number;
    totalRevenue: number;
    overdueInvoices: number;
    recentCustomers: Customer[];
    recentInvoices: Invoice[];
    recentPayments: Payment[];
}

export const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalCustomers: 0,
        totalInvoices: 0,
        totalRevenue: 0,
        overdueInvoices: 0,
        recentCustomers: [],
        recentInvoices: [],
        recentPayments: []
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [customers, invoices, payments] = await Promise.all([
                customerService.getAllCustomers(),
                invoiceService.getAllInvoices(),
                paymentService.getAllPayments()
            ]);

            const overdueInvoices = invoices.filter(invoice => {
                const dueDate = new Date(invoice.dueDate);
                const today = new Date();
                return invoice.paymentStatus === 'UNPAID' && dueDate < today;
            }).length;

            const totalRevenue = payments.reduce((sum, payment) => 
                sum + Number(payment.amount), 0
            );

            setStats({
                totalCustomers: customers.length,
                totalInvoices: invoices.length,
                totalRevenue,
                overdueInvoices,
                recentCustomers: customers.slice(-5).reverse(),
                recentInvoices: invoices.slice(-5).reverse(),
                recentPayments: payments.slice(-5).reverse()
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
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
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h6">{stats.totalCustomers}</Typography>
                            <Typography color="textSecondary">Total Customers</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ReceiptIcon color="primary" sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h6">{stats.totalInvoices}</Typography>
                            <Typography color="textSecondary">Total Invoices</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <MoneyIcon color="primary" sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h6">${stats.totalRevenue.toFixed(2)}</Typography>
                            <Typography color="textSecondary">Total Revenue</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <WarningIcon color="error" sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h6">{stats.overdueInvoices}</Typography>
                            <Typography color="textSecondary">Overdue Invoices</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Recent Customers
                            </Typography>
                            <List>
                                {stats.recentCustomers.map(customer => (
                                    <ListItem key={customer.id}>
                                        <ListItemText
                                            primary={customer.name}
                                            secondary={customer.email}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Recent Invoices
                            </Typography>
                            <List>
                                {stats.recentInvoices.map(invoice => (
                                    <ListItem key={invoice.id}>
                                        <ListItemText
                                            primary={`#${invoice.invoiceNumber}`}
                                            secondary={`$${Number(invoice.amount).toFixed(2)} - ${invoice.paymentStatus}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Recent Payments
                            </Typography>
                            <List>
                                {stats.recentPayments.map(payment => (
                                    <ListItem key={payment.id}>
                                        <ListItemText
                                            primary={`$${Number(payment.amount).toFixed(2)}`}
                                            secondary={payment.paymentMethod}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}; 