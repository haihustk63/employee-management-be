import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const createJob = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const job = await prisma.job.create({
      data,
    });
    return res.status(200).send(job);
  } catch (err) {
    console.error(err);
  }
};

const getAllJobs = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;

  const jobs = await getJobsWithParams(req.query);
  const jobsWithoutLimit: any = await getJobsWithParams(req.query, false);

  const response = {
    page: +page,
    limit: +limit,
    data: jobs,
    total: jobsWithoutLimit?.length,
  };
  return res.status(200).send(response);
};

const getJobsWithParams = (query: any, withLimit: boolean = true) => {
  const { page = 1, limit = 10, keyword, typeOfJob, level, position } = query;

  return prisma.$queryRaw`
      SELECT job.id, job.title, job.type_of_job as typeOfJob, job.level, job.up_to as upTo, 
      job.job_detail as jobDetail, job.position_id as positionId, position.name as positionName 
      FROM job INNER JOIN position
      ON job.position_id = position.id
      WHERE 1
      ${keyword ? Prisma.sql`AND title LIKE ${`%${keyword}%`}` : Prisma.empty}
      ${typeOfJob ? Prisma.sql`AND type_of_job=${typeOfJob}` : Prisma.empty}
      ${level ? Prisma.sql`AND level=${level}` : Prisma.empty}
      ${position ? Prisma.sql`AND position_id=${position}` : Prisma.empty}
      ${limit && withLimit ? Prisma.sql`LIMIT ${page}` : Prisma.empty}
      ${
        page && withLimit
          ? Prisma.sql`OFFSET ${(+page - 1) * +limit}`
          : Prisma.empty
      }
    `;
};

const getJobById = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    if (!jobId) {
      return res.sendStatus(400);
    }

    const job = await prisma.job.findUnique({
      where: {
        id: Number(jobId),
      },
      include: {
        position: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.status(200).send(job);
  } catch (err) {
    console.error(err);
  }
};

const updateJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const { data } = req.body;

    const job = await prisma.job.update({
      where: {
        id: Number(jobId),
      },
      data,
    });

    return res.status(200).send(job);
  } catch (err) {
    console.error(err);
  }
};

const deleteJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    await prisma.job.delete({
      where: {
        id: Number(jobId),
      },
    });

    return res.status(200).send("OK");
  } catch (err) {
    console.error(err);
  }
};

export { createJob, getAllJobs, getJobById, updateJob, deleteJob };
