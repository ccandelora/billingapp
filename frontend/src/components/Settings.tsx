import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Grid,
    Snackbar,
    Alert
} from '@mui/material';
import { settingsService } from '../services/settingsService';
import { Settings as SettingsType } from '../types/Settings';

export const Settings: React.FC = () => {
    const [settings, setSettings] = useState<SettingsType | null>(null);
    const [saveStatus, setSaveStatus] = useState<{
        open: boolean;
        severity: 'success' | 'error';
        message: string;
    }>({
        open: false,
        severity: 'success',
        message: ''
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await settingsService.getSettings();
            setSettings(data);
        } catch (error) {
            console.error('Error loading settings:', error);
            setSaveStatus({
                open: true,
                severity: 'error',
                message: 'Error loading settings'
            });
        }
    };

    const handleSave = async () => {
        if (!settings) return;
        try {
            const updatedSettings = await settingsService.updateSettings(settings);
            setSettings(updatedSettings);
            setSaveStatus({
                open: true,
                severity: 'success',
                message: 'Settings saved successfully'
            });
        } catch (error) {
            console.error('Error saving settings:', error);
            setSaveStatus({
                open: true,
                severity: 'error',
                message: 'Error saving settings'
            });
        }
    };

    if (!settings) return null;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Settings</Typography>
            <Grid container spacing={3}>
                {/* Company Information */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Company Information</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Company Name"
                                value={settings.company.name}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    company: { ...settings.company, name: e.target.value }
                                })}
                                fullWidth
                            />
                            <TextField
                                label="Address"
                                value={settings.company.address}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    company: { ...settings.company, address: e.target.value }
                                })}
                                fullWidth
                                multiline
                                rows={2}
                            />
                            <TextField
                                label="Phone"
                                value={settings.company.phone}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    company: { ...settings.company, phone: e.target.value }
                                })}
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                value={settings.company.email}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    company: { ...settings.company, email: e.target.value }
                                })}
                                fullWidth
                            />
                            <TextField
                                label="Website"
                                value={settings.company.website}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    company: { ...settings.company, website: e.target.value }
                                })}
                                fullWidth
                            />
                            <TextField
                                label="Tax ID"
                                value={settings.company.taxId}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    company: { ...settings.company, taxId: e.target.value }
                                })}
                                fullWidth
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Invoice Settings */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Invoice Settings</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Invoice Prefix"
                                value={settings.invoice.prefix}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    invoice: { ...settings.invoice, prefix: e.target.value }
                                })}
                                fullWidth
                            />
                            <TextField
                                label="Next Invoice Number"
                                type="number"
                                value={settings.invoice.nextNumber}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    invoice: { ...settings.invoice, nextNumber: parseInt(e.target.value) }
                                })}
                                fullWidth
                            />
                            <TextField
                                label="Default Due Days"
                                type="number"
                                value={settings.invoice.defaultDueDays}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    invoice: { ...settings.invoice, defaultDueDays: parseInt(e.target.value) }
                                })}
                                fullWidth
                            />
                            <TextField
                                label="Default Terms"
                                value={settings.invoice.defaultTerms}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    invoice: { ...settings.invoice, defaultTerms: e.target.value }
                                })}
                                fullWidth
                            />
                            <TextField
                                label="Default Notes"
                                value={settings.invoice.defaultNotes}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    invoice: { ...settings.invoice, defaultNotes: e.target.value }
                                })}
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    size="large"
                >
                    Save Settings
                </Button>
            </Box>

            <Snackbar
                open={saveStatus.open}
                autoHideDuration={6000}
                onClose={() => setSaveStatus({ ...saveStatus, open: false })}
            >
                <Alert
                    onClose={() => setSaveStatus({ ...saveStatus, open: false })}
                    severity={saveStatus.severity}
                >
                    {saveStatus.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}; 