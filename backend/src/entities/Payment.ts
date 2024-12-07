import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Invoice } from "./Invoice";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Invoice, invoice => invoice.payments, { eager: true })
    invoice!: Invoice;

    @Column('decimal', { precision: 10, scale: 2 })
    amount!: number;

    @Column({ type: 'date' })
    paymentDate!: Date;

    @Column({ nullable: true })
    paymentMethod!: string;

    @Column({ nullable: true })
    reference!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ nullable: true })
    notes!: string;
} 