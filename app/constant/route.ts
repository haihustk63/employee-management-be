import { ROUTES } from "constants/index";
import { Router } from "express";
import { getTestQuestionContant } from "./controller";

const { TEST_QUESTION_CONSTANTS } = ROUTES;

const router = Router();

router.get(TEST_QUESTION_CONSTANTS, getTestQuestionContant);

export default router;
