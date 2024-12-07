import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Customer } from "../entities/Customer";
import { Tag } from "../entities/Tag";

export class CustomerController {
    static getCustomers = async (req: Request, res: Response): Promise<void> => {
        try {
            const customerRepository = AppDataSource.getRepository(Customer);
            const customers = await customerRepository.find();
            res.json(customers);
        } catch (error) {
            console.error('Error fetching customers:', error);
            res.status(500).json({ message: 'Error fetching customers' });
        }
    };

    static getCustomerById = async (req: Request, res: Response): Promise<void> => {
        try {
            const customerRepository = AppDataSource.getRepository(Customer);
            const customer = await customerRepository.findOneBy({ id: parseInt(req.params.id) });
            if (!customer) {
                res.status(404).json({ message: "Customer not found" });
                return;
            }
            res.json(customer);
        } catch (error) {
            res.status(500).json({ message: "Error fetching customer", error });
        }
    };

    static createCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, phone, company, notes, tags } = req.body;
            const customerRepository = AppDataSource.getRepository(Customer);
            const tagRepository = AppDataSource.getRepository(Tag);

            const customer = new Customer();
            customer.name = name;
            customer.email = email;
            customer.phone = phone;
            customer.company = company;
            customer.notes = notes;

            if (tags && tags.length > 0) {
                const tagEntities = await tagRepository.findByIds(tags.map((tag: Tag) => tag.id));
                customer.tags = tagEntities;
            }

            await customerRepository.save(customer);
            res.status(201).json(customer);
        } catch (error) {
            res.status(500).json({ message: "Error creating customer", error });
        }
    };

    static updateCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, phone, company, notes, tags } = req.body;
            const customerRepository = AppDataSource.getRepository(Customer);
            const tagRepository = AppDataSource.getRepository(Tag);

            const customer = await customerRepository.findOneBy({ id: parseInt(req.params.id) });
            if (!customer) {
                res.status(404).json({ message: "Customer not found" });
                return;
            }

            customer.name = name;
            customer.email = email;
            customer.phone = phone;
            customer.company = company;
            customer.notes = notes;

            if (tags && tags.length > 0) {
                const tagEntities = await tagRepository.findByIds(tags.map((tag: Tag) => tag.id));
                customer.tags = tagEntities;
            } else {
                customer.tags = [];
            }

            await customerRepository.save(customer);
            res.json(customer);
        } catch (error) {
            res.status(500).json({ message: "Error updating customer", error });
        }
    };

    static deleteCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const customerRepository = AppDataSource.getRepository(Customer);
            const customer = await customerRepository.findOneBy({ id: parseInt(req.params.id) });
            if (!customer) {
                res.status(404).json({ message: "Customer not found" });
                return;
            }
            await customerRepository.remove(customer);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: "Error deleting customer", error });
        }
    };
} 