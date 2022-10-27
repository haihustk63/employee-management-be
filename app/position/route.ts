import { Router } from "express";
import { ROUTES } from "constants/index";
import { createNewPosition, getAllPositions } from "./controller";

const { POSITION } = ROUTES;

const router = Router();

router.get(POSITION, getAllPositions);

router.post(POSITION, createNewPosition);

export default router;
