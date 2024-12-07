import { Router } from "express";
import customerRoutes from "./customerRoutes";
import invoiceRoutes from "./invoiceRoutes";
import paymentRoutes from "./paymentRoutes";
import tagRoutes from "./tagRoutes";

const router = Router();

router.use("/customers", customerRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/payments", paymentRoutes);
router.use("/tags", tagRoutes);

export default router; 