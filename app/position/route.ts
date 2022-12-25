import { Router } from "express";
import { ROUTES } from "constants/index";
import {
  createNewPosition,
  getAllPositions,
  updatePosition,
  deletePosition,
} from "./controller";

const { POSITION, POSITION_MODIFY } = ROUTES;

const router = Router();

router.get(POSITION, getAllPositions);

router.post(POSITION, createNewPosition);

router.patch(POSITION_MODIFY, updatePosition);

router.delete(POSITION_MODIFY, deletePosition);

export default router;
