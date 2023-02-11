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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestStatistics = exports.getCandidateStatistics = exports.getEducationProgramStatistics = exports.getJobStatistics = exports.getApplicationStatistics = void 0;
const common_1 = require("@constants/common");
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
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
const getApplicationStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { timeType } = req.query;
    timeType = parseInt(timeType);
    let data;
    const allApplications = yield prisma.candidate.findMany();
    switch (timeType) {
        case common_1.TIME_FILTER_TYPES.allTime.value: {
            const count = allApplications.length;
            data = { count };
            break;
        }
        case common_1.TIME_FILTER_TYPES.year.value:
            data = statisticsApplicationByYear(allApplications);
            break;
        case common_1.TIME_FILTER_TYPES.quarter.value: {
            const { year } = req.query;
            if (!year) {
                return res.sendStatus(400);
            }
            data = statisticsApplicationByQuarter(allApplications, parseInt(year));
            break;
        }
        case common_1.TIME_FILTER_TYPES.month.value: {
            const { year } = req.query;
            if (!year) {
                return res.sendStatus(400);
            }
            data = statisticsApplicationByMonth(allApplications, parseInt(year));
            break;
        }
    }
    return res.status(200).send(data);
});
exports.getApplicationStatistics = getApplicationStatistics;
const statisticsApplicationByYear = (allApplications) => {
    const infoMap = new Map();
    allApplications.map((application) => {
        const { createdAt } = application;
        const year = (0, dayjs_1.default)(createdAt).year();
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
const statisticsApplicationByQuarter = (allApplications, year) => {
    const infoMap = new Map();
    for (let i = 1; i <= 4; i++) {
        infoMap.set(i, []);
    }
    allApplications.map((application) => {
        const { createdAt } = application;
        const applicationYear = (0, dayjs_1.default)(createdAt).year();
        if (applicationYear === year) {
            const applicationMonth = (0, dayjs_1.default)(createdAt).month();
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
const getQuarter = (month) => {
    return Math.floor(month / 3) + 1;
};
const statisticsApplicationByMonth = (allApplications, year) => {
    const infoMap = new Map();
    for (let i = 0; i < 12; i++) {
        infoMap.set(i, []);
    }
    allApplications.map((application) => {
        const { createdAt } = application;
        const applicationYear = (0, dayjs_1.default)(createdAt).year();
        if (applicationYear === year) {
            const month = (0, dayjs_1.default)(createdAt).month();
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
const getJobStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getJobStatistics = getJobStatistics;
const getEducationProgramStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getEducationProgramStatistics = getEducationProgramStatistics;
const getCandidateStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getCandidateStatistics = getCandidateStatistics;
const getRequestStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getRequestStatistics = getRequestStatistics;
