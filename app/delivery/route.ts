import { Router } from "express";
import { ROUTES } from "@constants/index";
import {
  createNewDelivery,
  getAllDeliveries,
  updateDelivery,
  deleteDelivery
} from "./controller";

const { DELIVERY, DELIVERY_MODIFY } = ROUTES;

const router = Router();

router.get(DELIVERY, getAllDeliveries);

router.post(DELIVERY, createNewDelivery);

router.patch(DELIVERY_MODIFY, updateDelivery);

router.delete(DELIVERY_MODIFY, deleteDelivery);

export default router;
