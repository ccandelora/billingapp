import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController';
import { RequestHandler } from 'express';

const router = Router();

// Update method name to match the controller
const getAllCustomers: RequestHandler = (req, res) => CustomerController.getCustomers(req, res);
const getCustomerById: RequestHandler = (req, res) => CustomerController.getCustomerById(req, res);
const createCustomer: RequestHandler = (req, res) => CustomerController.createCustomer(req, res);
const updateCustomer: RequestHandler = (req, res) => CustomerController.updateCustomer(req, res);
const deleteCustomer: RequestHandler = (req, res) => CustomerController.deleteCustomer(req, res);

router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router; 