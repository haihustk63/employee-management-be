import { sendEmail } from "@config/mailtrap";
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
  try {
    const { title, typeOfJob, level, positionId } = req.query;

    const jobs = await prisma.$queryRaw`
      SELECT job.id, job.title, job.type_of_job as typeOfJob, job.level, job.up_to as upTo, 
      job.job_detail as job_detail, job.position_id as positionId, position.name as positionName 
      FROM job INNER JOIN position
      ON job.position_id = position.id
      WHERE 1
      ${title ? Prisma.sql`AND title LIKE ${`%${title}%`}` : Prisma.empty}
      ${typeOfJob ? Prisma.sql`AND type_of_job=${typeOfJob}` : Prisma.empty}
      ${level ? Prisma.sql`AND level=${level}` : Prisma.empty}
      ${positionId ? Prisma.sql`AND position_id=${positionId}` : Prisma.empty}
    `;
    return res.status(200).send({ allJobs: jobs });
  } catch (err) {
    console.error(err);
  }
};

const getJobById = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
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
