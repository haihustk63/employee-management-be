import { ROUTES } from "constants/index";
import { Router } from "express";
import { getTestQuestionConstant, getRoleConstant } from "./controller";

const { TEST_QUESTION_CONSTANTS, ROLES_CONSTANTS } = ROUTES;

const router = Router();

router.get(TEST_QUESTION_CONSTANTS, getTestQuestionConstant);

router.get(ROLES_CONSTANTS, getRoleConstant);

export default router;
