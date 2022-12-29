import { Router } from "express";
import { ROUTES } from "constants/index";
import {
  getOneTestQuestion,
  createNewRequest,
  deleteRequest,
  updateRequest,
  getRequests,
} from "./controller";

const { REQUESTS, REQUESTS_MODIFY } = ROUTES;

const router = Router();

router.get(REQUESTS, getRequests);

router.post(REQUESTS, createNewRequest);

router.get(REQUESTS_MODIFY, getOneTestQuestion);

router.patch(REQUESTS_MODIFY, updateRequest);

router.delete(REQUESTS_MODIFY, deleteRequest);

export default router;
