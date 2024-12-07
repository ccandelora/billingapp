import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Customer } from './Customer';
import { Payment } from './Payment';

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    invoiceNumber!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount!: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    paidAmount!: number;

    @Column({
        type: 'varchar',
        default: 'UNPAID',
        // Can be: UNPAID, PARTIALLY_PAID, PAID, OVERPAID
        enum: ['UNPAID', 'PARTIALLY_PAID', 'PAID', 'OVERPAID']
    })
    paymentStatus!: string;

    @ManyToOne(() => Customer, (customer) => customer.invoices, { eager: true })
    customer!: Customer;

    @Column({ type: 'date' })
    dueDate!: Date;

    @Column({ default: false })
    paid!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ nullable: true })
    notes?: string;

    @OneToMany(() => Payment, payment => payment.invoice)
    payments: Payment[];
} 