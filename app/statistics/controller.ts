import { TIME_FILTER_TYPES } from "@constants/common";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { RequestHandler } from "express";

const prisma = new PrismaClient();

// strategies
/*
Get info by month, quarter, year
- How many applications were created (search by jobs)
- How many candidates were passed interview
- How many education programs were hold (top 10 highest rate)
- How many requests were created (search by type)
- How many jobs were created
- How many access to the company's website --> pending
*/

const getApplicationStatistics: RequestHandler = async (req, res, next) => {
  try {
    const { timeType = TIME_FILTER_TYPES.allTime.value } = req.query as any;
    let data;

    const allApplications = await prisma.candidate.findMany();
    switch (+timeType) {
      case TIME_FILTER_TYPES.allTime.value: {
        const count = allApplications.length;
        data = { count };
        break;
      }
      case TIME_FILTER_TYPES.year.value:
        data = statisticsByYear(allApplications);
        break;
      case TIME_FILTER_TYPES.quarter.value: {
        const { year } = req.query as any;
        if (!year) {
          return res.sendStatus(400);
        }
        data = statisticsByQuarter(allApplications, parseInt(year));
        break;
      }

      case TIME_FILTER_TYPES.month.value: {
        const { year } = req.query as any;
        if (!year) {
          return res.sendStatus(400);
        }
        data = statisticsByMonth(allApplications, parseInt(year));
        break;
      }
    }
    return res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

const getJobStatistics: RequestHandler = async (req, res, next) => {};
const getEducationProgramStatistics: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { timeType = TIME_FILTER_TYPES.allTime.value } = req.query as any;
    let data;

    const allEducationPrograms = await prisma.educationProgram.findMany();
    switch (+timeType) {
      case TIME_FILTER_TYPES.allTime.value: {
        const count = allEducationPrograms.length;
        data = { count };
        break;
      }
      case TIME_FILTER_TYPES.year.value:
        data = statisticsByYear(allEducationPrograms);
        break;
      case TIME_FILTER_TYPES.quarter.value: {
        const { year } = req.query as any;
        if (!year) {
          return res.sendStatus(400);
        }
        data = statisticsByQuarter(allEducationPrograms, parseInt(year));
        break;
      }

      case TIME_FILTER_TYPES.month.value: {
        const { year } = req.query as any;
        if (!year) {
          return res.sendStatus(400);
        }
        data = statisticsByMonth(allEducationPrograms, parseInt(year));
        break;
      }
    }
    return res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};
const getCandidateStatistics: RequestHandler = async (req, res, next) => {};
const getRequestStatistics: RequestHandler = async (req, res, next) => {};

const getTops: RequestHandler = async (req, res, next) => {
  try {
    const topEducationPrograms = await prisma.$queryRaw`
      SELECT ap.id AS id, ap.title AS title, ROUND(avg(ee.rate)) as averageRate
      FROM education_program AS ap
      INNER JOIN 
      (SELECT * FROM employee_education
      WHERE rate IS NOT NULL) AS ee 
      ON ap.id = ee.program_id
      GROUP BY ap.id
      ORDER BY averageRate desc
      LIMIT 10
    `;

    return res.status(200).send({
      topEducationPrograms,
    });
  } catch (error) {
    next(error);
  }
};

const statisticsByYear = (items: any[]) => {
  const infoMap = new Map();
  items.map((item) => {
    const { createdAt } = item;
    const year = dayjs(createdAt).year();
    infoMap.set(year, [...(infoMap.get(year) || []), item]);
  });
  const filteredData = [...infoMap];
  const statistics = filteredData.map(([year, filteredItems]) => {
    return {
      year,
      count: filteredItems.length,
    };
  });
  return statistics;
};

const statisticsByQuarter = (data: any[], year: number) => {
  const infoMap = new Map();
  for (let i = 1; i <= 4; i++) {
    infoMap.set(i, []);
  }
  data.map((item) => {
    const { createdAt } = item;
    const itemYear = dayjs(createdAt).year();
    if (itemYear === year) {
      const itemMonth = dayjs(createdAt).month();
      const quarter = getQuarter(itemMonth);
      console.log(quarter);
      infoMap.set(quarter, [...(infoMap.get(quarter) || []), item]);
    }
  });
  const filteredData = [...infoMap];
  const statistics = filteredData.map(([quarter, filteredItems]) => {
    return {
      quarter,
      count: filteredItems.length,
    };
  });
  return statistics;
};

const getQuarter = (month: number) => {
  return Math.floor(month / 3) + 1;
};

const statisticsByMonth = (data: any[], year: number) => {
  const infoMap = new Map();
  for (let i = 0; i < 12; i++) {
    infoMap.set(i, []);
  }
  data.map((item) => {
    const { createdAt } = item;
    const itemYear = dayjs(createdAt).year();
    if (itemYear === year) {
      const month = dayjs(createdAt).month();
      infoMap.set(month, [...(infoMap.get(month) || []), item]);
    }
  });
  const filteredData = [...infoMap];
  const statistics = filteredData.map(([month, filteredItems]) => {
    return {
      month: month + 1,
      count: filteredItems.length,
    };
  });
  return statistics;
};

export {
  getApplicationStatistics,
  getJobStatistics,
  getEducationProgramStatistics,
  getCandidateStatistics,
  getRequestStatistics,
  getTops,
};
