import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController";

const router = Router();

router.get("/", PaymentController.getAllPayments);
router.post("/", PaymentController.createPayment);

export default router; 