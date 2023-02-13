import { Router } from "express";
import { ROUTES } from "@constants/index";
import {
  getOneRequest,
  createNewRequest,
  deleteRequest,
  updateRequest,
  getRequests,
} from "./controller";
import { authMiddleware } from "@middleware/index";

const { REQUESTS, REQUESTS_MODIFY } = ROUTES;

const router = Router();

router.get(REQUESTS, authMiddleware, getRequests);

router.post(REQUESTS, authMiddleware, createNewRequest);

router.get(REQUESTS_MODIFY, authMiddleware, getOneRequest);

router.patch(REQUESTS_MODIFY, authMiddleware, updateRequest);

router.delete(REQUESTS_MODIFY, authMiddleware, deleteRequest);

export default router;
