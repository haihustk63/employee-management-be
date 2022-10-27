import { Router } from "express";
import { ROUTES } from "@constants/index";
import {
  createNewDelivery,
  getAllDeliveries,
  updateDelivery,
} from "./controller";

const { DELIVERY, DELIVERY_MODIFY } = ROUTES;

const router = Router();

router.get(DELIVERY, getAllDeliveries);

router.post(DELIVERY, createNewDelivery);

router.patch(DELIVERY_MODIFY, updateDelivery);

export default router;
