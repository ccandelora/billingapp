import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Settings } from '../entities/Settings';
import { DeepPartial } from 'typeorm';

export class SettingsController {
    static getSettings = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('Fetching settings...');
            const settingsRepository = AppDataSource.getRepository(Settings);
            let settings = await settingsRepository.findOne({
                where: {}
            });
            
            if (!settings) {
                console.log('No settings found, creating default settings...');
                const defaultSettings: DeepPartial<Settings> = {
                    company: {
                        name: '',
                        address: '',
                        phone: '',
                        email: '',
                        website: '',
                        taxId: ''
                    },
                    invoice: {
                        prefix: 'INV-',
                        nextNumber: 1000,
                        defaultDueDays: 30,
                        defaultTerms: 'Net 30',
                        defaultNotes: 'Thank you for your business!'
                    },
                    email: {
                        fromName: '',
                        fromEmail: '',
                        useCustomSMTP: false
                    },
                    emailTemplates: {
                        invoiceCreated: {
                            subject: 'New Invoice #{invoiceNumber}',
                            body: 'Dear {customerName},\n\nPlease find attached invoice #{invoiceNumber}.',
                            enabled: true
                        },
                        paymentReceived: {
                            subject: 'Payment Received for Invoice #{invoiceNumber}',
                            body: 'Dear {customerName},\n\nWe have received your payment.',
                            enabled: true
                        },
                        invoiceOverdue: {
                            subject: 'Overdue Invoice #{invoiceNumber}',
                            body: 'Dear {customerName},\n\nThis is a reminder that invoice #{invoiceNumber} is overdue.',
                            enabled: true
                        }
                    },
                    ui: {
                        theme: 'light',
                        dateFormat: 'MM/DD/YYYY',
                        timeFormat: '12h',
                        timezone: 'UTC',
                        currency: 'USD',
                        language: 'en'
                    }
                };

                settings = await settingsRepository.save(settingsRepository.create(defaultSettings));
                console.log('Created default settings:', settings);
            }
            
            res.json(settings);
        } catch (error) {
            console.error('Error in getSettings:', error);
            res.status(500).json({ 
                message: 'Error fetching settings', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    };

    static updateSettings = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('Received settings update:', req.body);
            const settingsRepository = AppDataSource.getRepository(Settings);
            let settings = await settingsRepository.findOne({
                where: {}
            });

            if (!settings) {
                console.log('No settings found, creating new settings');
                const newSettings = settingsRepository.create(req.body as DeepPartial<Settings>);
                settings = await settingsRepository.save(newSettings);
            } else {
                console.log('Existing settings found, merging with updates');
                const updatedSettings = settingsRepository.merge(settings, req.body as DeepPartial<Settings>);
                settings = await settingsRepository.save(updatedSettings);
            }

            console.log('Settings saved successfully:', settings);
            res.json(settings);
        } catch (error) {
            console.error('Error in updateSettings:', error);
            res.status(500).json({ 
                message: 'Error updating settings', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    };
} 