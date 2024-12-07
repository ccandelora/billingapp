import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
    Container, AppBar, Toolbar, Box,
    Typography, Drawer, List, ListItem, ListItemIcon,
    ListItemText, Divider
} from '@mui/material';
import {
    People as PeopleIcon,
    Receipt as ReceiptIcon,
    LocalOffer as TagIcon,
    Dashboard as DashboardIcon,
    Payment as PaymentIcon,
    Assessment as AssessmentIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { CustomerList } from './components/CustomerList';
import { CustomerForm } from './components/CustomerForm';
import { InvoiceList } from './components/InvoiceList';
import { InvoiceForm } from './components/InvoiceForm';
import { TagList } from './components/TagList';
import { TagForm } from './components/TagForm';
import { PaymentList } from './components/PaymentList';
import { PaymentForm } from './components/PaymentForm';
import { Dashboard } from './components/Dashboard';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';

const drawerWidth = 240;

const App: React.FC = () => {
    return (
        <Router>
            <Box sx={{ display: 'flex' }}>
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            Invoice Manager
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            <ListItem button component="a" href="/">
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItem>
                            <ListItem button component="a" href="/customers">
                                <ListItemIcon>
                                    <PeopleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Customers" />
                            </ListItem>
                            <ListItem button component="a" href="/invoices">
                                <ListItemIcon>
                                    <ReceiptIcon />
                                </ListItemIcon>
                                <ListItemText primary="Invoices" />
                            </ListItem>
                            <ListItem button component="a" href="/payments">
                                <ListItemIcon>
                                    <PaymentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Payments" />
                            </ListItem>
                            <ListItem button component="a" href="/tags">
                                <ListItemIcon>
                                    <TagIcon />
                                </ListItemIcon>
                                <ListItemText primary="Tags" />
                            </ListItem>
                            <ListItem button component="a" href="/reports">
                                <ListItemIcon>
                                    <AssessmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Reports" />
                            </ListItem>
                            <ListItem button component="a" href="/settings">
                                <ListItemIcon>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Settings" />
                            </ListItem>
                        </List>
                        <Divider />
                    </Box>
                </Drawer>

                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    <Container>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/customers" element={<CustomerList />} />
                            <Route path="/customers/new" element={<CustomerForm />} />
                            <Route path="/customers/edit/:id" element={<CustomerForm />} />
                            <Route path="/invoices" element={<InvoiceList />} />
                            <Route path="/invoices/new" element={<InvoiceForm />} />
                            <Route path="/invoices/edit/:id" element={<InvoiceForm />} />
                            <Route path="/payments" element={<PaymentList />} />
                            <Route path="/payments/new" element={<PaymentForm />} />
                            <Route path="/tags" element={<TagList />} />
                            <Route path="/tags/new" element={<TagForm />} />
                            <Route path="/tags/edit/:id" element={<TagForm />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </Container>
                </Box>
            </Box>
        </Router>
    );
};

export default App; 