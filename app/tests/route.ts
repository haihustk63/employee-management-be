import { Router } from "express";
import { ROUTES } from "constants/index";
import { createTest } from "./controller";

const { CREATE_TEST } = ROUTES;

const router = Router();

router.post(CREATE_TEST, createTest);

export default router;
