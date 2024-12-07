import { Router } from "express";
import { InvoiceController } from "../controllers/InvoiceController";

const router = Router();

router.get("/", InvoiceController.getAllInvoices);
router.post("/", InvoiceController.createInvoice);
router.patch("/:id/status", InvoiceController.updateInvoiceStatus);

export default router; 