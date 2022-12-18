import { Router } from "express";
import { ROUTES } from "constants/index";
import { createTest, saveTest, getTest } from "./controller";

const { CREATE_TEST, SAVE_TEST, TEST_MODIFY } = ROUTES;

const router = Router();

router.get(TEST_MODIFY, getTest);
router.post(CREATE_TEST, createTest);
router.post(SAVE_TEST, saveTest);

export default router;
