import { Router } from "express";
import { ROUTES } from "constants/index";
import {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob,
  updateJob,
} from "./controller";

const { JOBS, JOBS_MODIFY } = ROUTES;

const router = Router();

//get test
router.get(JOBS, getAllJobs);
router.post(JOBS, createJob);
router.get(JOBS_MODIFY, getJobById);
router.patch(JOBS_MODIFY, updateJob);
router.delete(JOBS_MODIFY, deleteJob);

export default router;
