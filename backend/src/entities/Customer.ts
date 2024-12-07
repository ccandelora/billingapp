import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Tag } from './Tag';
import { Invoice } from './Invoice';

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    company: string;

    @Column({ nullable: true })
    notes: string;

    @ManyToMany(() => Tag, tag => tag.customers)
    @JoinTable()
    tags: Tag[];

    @OneToMany(() => Invoice, invoice => invoice.customer)
    invoices: Invoice[];
} 