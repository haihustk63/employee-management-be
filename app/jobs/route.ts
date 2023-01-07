import { Router } from "express";
import { ROUTES } from "constants/index";
import {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob,
  updateJob,
} from "./controller";
import { authMiddleware } from "@middleware/index";

const { JOBS, JOBS_MODIFY } = ROUTES;

const router = Router();

//get test
router.get(JOBS, getAllJobs);
router.post(JOBS, authMiddleware, createJob);
router.get(JOBS_MODIFY, authMiddleware, getJobById);
router.patch(JOBS_MODIFY, authMiddleware, updateJob);
router.delete(JOBS_MODIFY, authMiddleware, deleteJob);

export default router;
