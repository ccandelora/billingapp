import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Settings {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('simple-json')
    company: {
        name: string;
        address: string;
        phone: string;
        email: string;
        website: string;
        taxId: string;
    };

    @Column('simple-json')
    invoice: {
        prefix: string;
        nextNumber: number;
        defaultDueDays: number;
        defaultTerms: string;
        defaultNotes: string;
        defaultTaxRate: number;
        defaultCurrency: string;
    };

    @Column('simple-json', { nullable: true })
    email: {
        fromName: string;
        fromEmail: string;
        useCustomSMTP: boolean;
    };

    @Column('simple-json', { nullable: true })
    emailTemplates: {
        invoiceCreated: {
            subject: string;
            body: string;
            enabled: boolean;
        };
        paymentReceived: {
            subject: string;
            body: string;
            enabled: boolean;
        };
        invoiceOverdue: {
            subject: string;
            body: string;
            enabled: boolean;
        };
    };

    @Column('simple-json', { nullable: true })
    ui: {
        theme: string;
        dateFormat: string;
        timeFormat: string;
        timezone: string;
        currency: string;
        language: string;
    };
} 