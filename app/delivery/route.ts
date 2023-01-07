import { Router } from "express";
import { ROUTES } from "@constants/index";
import {
  createNewDelivery,
  getAllDeliveries,
  updateDelivery,
  deleteDelivery,
} from "./controller";
import { authMiddleware } from "@middleware/index";

const { DELIVERY, DELIVERY_MODIFY } = ROUTES;

const router = Router();

router.get(DELIVERY, authMiddleware, getAllDeliveries);

router.post(DELIVERY, authMiddleware, createNewDelivery);

router.patch(DELIVERY_MODIFY, authMiddleware, updateDelivery);

router.delete(DELIVERY_MODIFY, authMiddleware, deleteDelivery);

export default router;
