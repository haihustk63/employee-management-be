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
exports.getCheckInOutTimesheet = exports.getCheckInOutList = exports.getCheckInOutInfo = exports.checkInOut = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const client_1 = require("@prisma/client");
const common_1 = require("../../constants/common");
const { UNPAID_LEAVE, UNPAID_AFTERNOON_LEAVE, UNPAID_MORNING_LEAVE, ANNUAL_AFTERNOON_LEAVE, ANNUAL_LEAVE, ANNUAL_MORNING_LEAVE, } = common_1.REQUEST_TYPES;
const leaveRequestTypes = [
    UNPAID_LEAVE,
    UNPAID_AFTERNOON_LEAVE,
    UNPAID_MORNING_LEAVE,
    ANNUAL_AFTERNOON_LEAVE,
    ANNUAL_LEAVE,
    ANNUAL_MORNING_LEAVE,
];
const TARGET_TIME = {
    IN_MORNING: 1,
    IN_REST: 2,
    IN_AFTERNOON: 3,
};
const prisma = new client_1.PrismaClient();
const checkInOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.body.data;
        const { id: employeeId } = res.getHeader("user");
        const isChecked = yield getChecked(type, employeeId);
        if (isChecked.isChecked) {
            throw new Error("You have checked in/out today");
        }
        const checkInReq = yield prisma.checkInOut.create({
            data: {
                employeeId: Number(employeeId),
                type: Number(type),
            },
        });
        return res.status(200).send(checkInReq);
    }
    catch (error) {
        return res.status(400).send(error.message);
    }
});
exports.checkInOut = checkInOut;
const getCheckInOutInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeeId } = res.getHeader("user");
        const { type } = req.query;
        if (!type) {
            throw new Error("Type is required");
        }
        const isChecked = yield getChecked(type, employeeId);
        return res.status(200).send(isChecked);
    }
    catch (error) {
        return res.status(400).send(error.message);
    }
});
exports.getCheckInOutInfo = getCheckInOutInfo;
const getChecked = (type, employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    const checkInOutInfo = yield prisma.checkInOut.findFirst({
        where: {
            employeeId,
            type: Number(type),
            time: {
                gte: new Date((0, dayjs_1.default)().format("YYYY-MM-DD")),
                lt: new Date((0, dayjs_1.default)().add(1, "day").format("YYYY-MM-DD")),
            },
        },
    });
    return {
        isChecked: checkInOutInfo ? true : false,
        time: checkInOutInfo === null || checkInOutInfo === void 0 ? void 0 : checkInOutInfo.time,
    };
});
const getCheckInOutList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date().toDateString();
        const checkInOutInfo = yield prisma.checkInOut.findMany({
            include: {
                employee: {
                    select: {
                        firstName: true,
                        lastName: true,
                        middleName: true,
                    },
                },
            },
        });
        const todayInfo = checkInOutInfo.filter((record) => new Date(record.time).toDateString() === today);
        const infoMap = new Map();
        todayInfo.map((item) => {
            const { employeeId, type, time, employee } = item;
            if (type === 0) {
                infoMap.set(employeeId, Object.assign(infoMap.get(employeeId) || {}, {
                    checkin: time,
                    employee,
                    employeeId,
                }));
            }
            else {
                infoMap.set(employeeId, Object.assign(infoMap.get(employeeId) || {}, {
                    checkout: time,
                    employee,
                    employeeId,
                }));
            }
        });
        const response = Array.from(infoMap.values());
        return res.status(common_1.STATUS_CODE.SUCCESS).send(response);
    }
    catch (error) {
        console.log(error);
    }
});
exports.getCheckInOutList = getCheckInOutList;
const getCheckInOutTimesheet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: employeeId } = res.getHeader("user");
        const checkInOutRecords = yield prisma.checkInOut.findMany({
            where: {
                employeeId,
            },
        });
        const requestsRecords = yield prisma.request.findMany({
            where: {
                employeeId,
            },
        });
        const checkInOutByQuery = getRecordsByQuery(req.query, checkInOutRecords);
        const requestByQuery = getRecordsByQuery(req.query, requestsRecords);
        const readableCheckInOut = getReadableInfo(checkInOutByQuery);
        const filteredLeaveRequests = filterLeaveRequest(requestByQuery);
        const groupData = createGroupInfoByDay(readableCheckInOut, filteredLeaveRequests);
        const lastResult = groupData.map(workingTime);
        const total = (0, dayjs_1.default)().daysInMonth();
        return res.status(common_1.STATUS_CODE.SUCCESS).send({ data: lastResult, total });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getCheckInOutTimesheet = getCheckInOutTimesheet;
const getRecordsByQuery = (query, records) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const { month = currentMonth, year = currentYear } = query;
    return records.filter((record) => {
        var _a;
        const date = new Date((_a = record.time) !== null && _a !== void 0 ? _a : record.date);
        return date.getMonth() === month && date.getFullYear() === year;
    });
};
const getReadableInfo = (records) => {
    return records.map((record) => {
        const recordTime = (0, dayjs_1.default)(record.time);
        return {
            day: recordTime.get("date"),
            time: recordTime.format("HH:mm"),
            type: record.type,
        };
    });
};
const filterLeaveRequest = (requests) => {
    const leaveRequestTypeValues = leaveRequestTypes.map((type) => type.value);
    return requests.filter((request) => leaveRequestTypeValues.includes(request.type));
};
const createGroupInfoByDay = (checkInOutData, filteredLeaveRequests) => {
    const infoMap = new Map();
    checkInOutData.forEach((item) => {
        const { day, type, time } = item;
        if (type === 0) {
            infoMap.set(day, Object.assign(infoMap.get(day) || {}, {
                checkin: time,
                day,
            }));
        }
        else {
            infoMap.set(day, Object.assign(infoMap.get(day) || {}, {
                checkout: time,
                day,
            }));
        }
    });
    filteredLeaveRequests.forEach((item) => {
        const { type, date, status, isCancelled, reason } = item;
        if (status === common_1.REQUEST_STATUS.ACCEPTED.value ||
            (isCancelled && status === common_1.REQUEST_STATUS.REJECTED.value)) {
            const day = (0, dayjs_1.default)(date).get("date");
            infoMap.set(day, Object.assign(infoMap.get(day) || {}, {
                requestType: type,
                reason,
                day,
            }));
        }
    });
    const groupData = Array.from(infoMap.values());
    return groupData;
};
const workingTime = (attendanceInfo) => {
    const { checkin = "", checkout = "", day = "", requestType = "", reason = "", } = attendanceInfo;
    let workingMinute = 0;
    if (checkin && checkout) {
        const checkinTargetTime = getTargetTime(checkin);
        const checkoutTargetTime = getTargetTime(checkout);
        if (checkinTargetTime === TARGET_TIME.IN_MORNING &&
            checkoutTargetTime === TARGET_TIME.IN_AFTERNOON) {
            workingMinute = getDiffMinute(checkout, checkin) - getRestDuration();
        }
        else if (checkinTargetTime === TARGET_TIME.IN_MORNING &&
            checkinTargetTime === TARGET_TIME.IN_REST) {
            workingMinute = getDiffMinute(common_1.WORKING_TIME.MORNING_END, checkin);
        }
        else if (checkinTargetTime === TARGET_TIME.IN_REST &&
            checkinTargetTime === TARGET_TIME.IN_AFTERNOON) {
            workingMinute = getDiffMinute(checkout, common_1.WORKING_TIME.AFTERNOON_START);
        }
        else {
            if (checkinTargetTime === checkoutTargetTime) {
                if (checkinTargetTime === TARGET_TIME.IN_MORNING ||
                    checkinTargetTime === TARGET_TIME.IN_AFTERNOON) {
                    workingMinute = getDiffMinute(checkout, checkin);
                }
                else {
                    workingMinute = 0;
                }
            }
        }
    }
    const workingHour = getWorkingHour(workingMinute);
    return {
        checkin,
        checkout,
        day,
        workingHour,
        requestType,
        note: reason,
    };
};
const getWorkingHour = (workingMinute) => {
    const hours = workingMinute / 60;
    const minutes = workingMinute % 60;
    return (0, dayjs_1.default)().hour(hours).minute(minutes).format("HH:mm");
};
const getTargetTime = (timeString) => {
    const diffMorningEnd = getDiffMinute(common_1.WORKING_TIME.MORNING_END, timeString);
    const diffAfternoonStart = getDiffMinute(common_1.WORKING_TIME.AFTERNOON_START, timeString);
    if (diffMorningEnd >= 0)
        return TARGET_TIME.IN_MORNING;
    else {
        if (diffAfternoonStart >= 0) {
            return TARGET_TIME.IN_REST;
        }
        else {
            return TARGET_TIME.IN_AFTERNOON;
        }
    }
};
const getRestDuration = () => {
    return getDiffMinute(common_1.WORKING_TIME.AFTERNOON_START, common_1.WORKING_TIME.MORNING_END);
};
const getDiffMinute = (endTime, startTime) => {
    const [endHour, endMinute] = getSplitTime(endTime);
    const [startHour, startMinute] = getSplitTime(startTime);
    return (endHour - startHour) * 60 + (endMinute - startMinute);
};
const getSplitTime = (hourString) => {
    const [hour, minute] = hourString.split(":");
    return [Number(hour), Number(minute)];
};
