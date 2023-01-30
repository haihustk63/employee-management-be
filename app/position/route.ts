import { Router } from "express";
import { ROUTES } from "constants/index";
import {
  createNewPosition,
  getAllPositions,
  updatePosition,
  deletePosition,
} from "./controller";
import { authMiddleware } from "@middleware/index";

const { POSITION, POSITION_MODIFY } = ROUTES;

const router = Router();

router.get(POSITION, getAllPositions);

router.post(POSITION, authMiddleware, createNewPosition);

router.patch(POSITION_MODIFY, authMiddleware, updatePosition);

router.delete(POSITION_MODIFY, authMiddleware, deletePosition);

export default router;
