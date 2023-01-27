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

const getApplicationStatistics: RequestHandler = async (req, res) => {
  let { timeType } = req.query as any;
  timeType = parseInt(timeType);
  let data;

  const allApplications = await prisma.candidate.findMany();
  switch (timeType) {
    case TIME_FILTER_TYPES.allTime.value: {
      const count = allApplications.length;
      data = { count };
      break;
    }
    case TIME_FILTER_TYPES.year.value:
      data = statisticsApplicationByYear(allApplications);
      break;
    case TIME_FILTER_TYPES.quarter.value: {
      const { year } = req.query as any;
      if (!year) {
        return res.sendStatus(400);
      }
      data = statisticsApplicationByQuarter(allApplications, parseInt(year));
      break;
    }

    case TIME_FILTER_TYPES.month.value: {
      const { year } = req.query as any;
      if (!year) {
        return res.sendStatus(400);
      }
      data = statisticsApplicationByMonth(allApplications, parseInt(year));
      break;
    }
  }
  return res.status(200).send(data);
};

const statisticsApplicationByYear = (allApplications: any[]) => {
  const infoMap = new Map();
  allApplications.map((application) => {
    const { createdAt } = application;
    const year = dayjs(createdAt).year();
    infoMap.set(year, [...(infoMap.get(year) || []), application]);
  });
  const filteredData = [...infoMap];
  const statistics = filteredData.map(([year, applications]) => {
    return {
      year,
      count: applications.length,
    };
  });
  return statistics;
};

const statisticsApplicationByQuarter = (
  allApplications: any[],
  year: number
) => {
  const infoMap = new Map();
  for (let i = 1; i <= 4; i++) {
    infoMap.set(i, []);
  }
  allApplications.map((application) => {
    const { createdAt } = application;
    const applicationYear = dayjs(createdAt).year();
    if (applicationYear === year) {
      const applicationMonth = dayjs(createdAt).month();
      const quarter = getQuarter(applicationMonth);
      console.log(quarter);
      infoMap.set(quarter, [...(infoMap.get(quarter) || []), application]);
    }
  });
  const filteredData = [...infoMap];
  const statistics = filteredData.map(([quarter, applications]) => {
    return {
      quarter,
      count: applications.length,
    };
  });
  return statistics;
};

const getQuarter = (month: number) => {
  return Math.floor(month / 3) + 1;
};

const statisticsApplicationByMonth = (allApplications: any[], year: number) => {
  const infoMap = new Map();
  for (let i = 0; i < 12; i++) {
    infoMap.set(i, []);
  }
  allApplications.map((application) => {
    const { createdAt } = application;
    const applicationYear = dayjs(createdAt).year();
    if (applicationYear === year) {
      const month = dayjs(createdAt).month();
      infoMap.set(month, [...(infoMap.get(month) || []), application]);
    }
  });
  const filteredData = [...infoMap];
  const statistics = filteredData.map(([month, applications]) => {
    return {
      month: month + 1,
      count: applications.length,
    };
  });
  return statistics;
};

const getJobStatistics: RequestHandler = async (req, res) => {};
const getEducationProgramStatistics: RequestHandler = async (req, res) => {};
const getCandidateStatistics: RequestHandler = async (req, res) => {};
const getRequestStatistics: RequestHandler = async (req, res) => {};

export {
  getApplicationStatistics,
  getJobStatistics,
  getEducationProgramStatistics,
  getCandidateStatistics,
  getRequestStatistics,
};
