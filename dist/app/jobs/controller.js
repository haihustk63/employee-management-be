"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.getJobById = exports.getAllJobs = exports.createJob = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const job = yield prisma.job.create({
            data,
        });
        return res.status(200).send(job);
    }
    catch (err) {
        console.error(err);
    }
});
exports.createJob = createJob;
const getAllJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, typeOfJob, level, positionId } = req.query;
        const jobs = yield prisma.$queryRaw `
      SELECT job.id, job.title, job.type_of_job as typeOfJob, job.level, job.up_to as upTo, 
      job.job_detail as job_detail, job.position_id as positionId, position.name as positionName 
      FROM job INNER JOIN position
      ON job.position_id = position.id
      WHERE 1
      ${title ? client_1.Prisma.sql `AND title LIKE ${`%${title}%`}` : client_1.Prisma.empty}
      ${typeOfJob ? client_1.Prisma.sql `AND type_of_job=${typeOfJob}` : client_1.Prisma.empty}
      ${level ? client_1.Prisma.sql `AND level=${level}` : client_1.Prisma.empty}
      ${positionId ? client_1.Prisma.sql `AND position_id=${positionId}` : client_1.Prisma.empty}
    `;
        return res.status(200).send({ allJobs: jobs });
    }
    catch (err) {
        console.error(err);
    }
});
exports.getAllJobs = getAllJobs;
const getJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.params;
        if (!jobId) {
            return res.sendStatus(400);
        }
        const job = yield prisma.job.findUnique({
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
    }
    catch (err) {
        console.error(err);
    }
});
exports.getJobById = getJobById;
const updateJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.params;
        const { data } = req.body;
        const job = yield prisma.job.update({
            where: {
                id: Number(jobId),
            },
            data,
        });
        return res.status(200).send(job);
    }
    catch (err) {
        console.error(err);
    }
});
exports.updateJob = updateJob;
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.params;
        yield prisma.job.delete({
            where: {
                id: Number(jobId),
            },
        });
        return res.status(200).send("OK");
    }
    catch (err) {
        console.error(err);
    }
});
exports.deleteJob = deleteJob;
