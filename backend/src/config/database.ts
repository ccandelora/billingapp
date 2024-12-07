import { DataSource } from 'typeorm';
import { Settings } from '../entities/Settings';
import { Customer } from '../entities/Customer';
import { Invoice } from '../entities/Invoice';
import { Payment } from '../entities/Payment';
import { Tag } from '../entities/Tag';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "ccandelora", 
    password: "", 
    database: "customer_billing", 
    synchronize: true, // Set to false in production
    logging: true,
    entities: [Settings, Customer, Invoice, Payment, Tag],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");
    } catch (error) {
        console.error("Error during Data Source initialization:", error);
        throw error;
    }
};