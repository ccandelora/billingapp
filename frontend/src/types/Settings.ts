export interface CompanySettings {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    taxId: string;
}

export interface InvoiceSettings {
    prefix: string;
    nextNumber: number;
    defaultDueDays: number;
    defaultTerms: string;
    defaultNotes: string;
    defaultTaxRate?: number;
    defaultCurrency?: string;
}

export interface EmailTemplate {
    subject: string;
    body: string;
    enabled?: boolean;
    ccEmails?: string[];
    bccEmails?: string[];
}

export interface EmailSettings {
    fromName: string;
    fromEmail: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpUsername?: string;
    smtpPassword?: string;
    useCustomSMTP: boolean;
}

export interface Settings {
    company: CompanySettings;
    invoice: InvoiceSettings;
    email: EmailSettings;
    emailTemplates: {
        invoiceCreated: EmailTemplate;
        paymentReceived: EmailTemplate;
        invoiceOverdue: EmailTemplate;
        invoiceReminder?: EmailTemplate;
        estimateCreated?: EmailTemplate;
    };
    ui: {
        theme: 'light' | 'dark' | 'system';
        dateFormat: string;
        timeFormat: string;
        timezone: string;
        currency: string;
        language: string;
    };
} 