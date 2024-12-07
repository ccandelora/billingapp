import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Customer } from './Customer';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    color: string;

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => Customer, customer => customer.tags)
    customers: Customer[];
} 