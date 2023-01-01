import dayjs from "dayjs";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import {
  STATUS_CODE,
  WORKING_TIME,
  REQUEST_TYPES,
  REQUEST_STATUS,
} from "@constants/common";

const {
  UNPAID_LEAVE,
  UNPAID_AFTERNOON_LEAVE,
  UNPAID_MORNING_LEAVE,
  ANNUAL_AFTERNOON_LEAVE,
  ANNUAL_LEAVE,
  ANNUAL_MORNING_LEAVE,
} = REQUEST_TYPES;

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

const prisma = new PrismaClient();

const checkInOut = async (req: Request, res: Response) => {
  try {
    const { type } = req.body.data;
    const { id: employeeId } = res.getHeader("user") as any;

    const isChecked = await getChecked(type as string, employeeId);

    if (isChecked.isChecked) {
      throw new Error("You have checked in/out today");
    }

    const checkInReq = await prisma.checkInOut.create({
      data: {
        employeeId: Number(employeeId),
        type: Number(type),
      },
    });

    return res.status(200).send(checkInReq);
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
};

const getCheckInOutInfo = async (req: Request, res: Response) => {
  try {
    const { id: employeeId } = res.getHeader("user") as any;
    const { type } = req.query;

    if (!type) {
      throw new Error("Type is required");
    }

    const isChecked = await getChecked(type as string, employeeId);

    return res.status(200).send(isChecked);
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
};

const getChecked = async (type: string, employeeId: string) => {
  const today = new Date().toDateString();

  const checkInOutInfo = await prisma.checkInOut.findMany({
    where: {
      employeeId: Number(employeeId),
      type: Number(type),
    },
  });

  const info = checkInOutInfo.find(
    (record) => new Date(record.time).toDateString() === today
  );

  return {
    isChecked: info ? true : false,
    time: info?.time,
  };
};

const getCheckInOutList = async (req: Request, res: Response) => {
  try {
    const today = new Date().toDateString();

    const checkInOutInfo = await prisma.checkInOut.findMany({
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

    const todayInfo = checkInOutInfo.filter(
      (record) => new Date(record.time).toDateString() === today
    );

    const infoMap = new Map();
    todayInfo.map((item) => {
      const { employeeId, type, time, employee } = item;
      if (type === 0) {
        infoMap.set(
          employeeId,
          Object.assign(infoMap.get(employeeId) || {}, {
            checkin: time,
            employee,
            employeeId,
          })
        );
      } else {
        infoMap.set(
          employeeId,
          Object.assign(infoMap.get(employeeId) || {}, {
            checkout: time,
            employee,
            employeeId,
          })
        );
      }
    });

    const response = Array.from(infoMap.values());

    return res.status(STATUS_CODE.SUCCESS).send(response);
  } catch (error) {
    console.log(error);
  }
};

const getCheckInOutTimesheet = async (req: Request, res: Response) => {
  try {
    // const { employeeId } = req.header("user");
    const checkInOutRecords = await prisma.checkInOut.findMany({
      where: {
        // employeeId: Number(employeeId),
        employeeId: 1,
      },
    });

    const requestsRecords = await prisma.request.findMany({
      where: {
        employeeId: 1,
      },
    });

    const checkInOutByQuery = getRecordsByQuery(req, checkInOutRecords);
    const requestByQuery = getRecordsByQuery(req, requestsRecords);
    const readableCheckInOut = getReadableInfo(checkInOutByQuery);
    const filteredLeaveRequests = filterLeaveRequest(requestByQuery);
    const groupData = createGroupInfoByDay(
      readableCheckInOut,
      filteredLeaveRequests
    );

    const lastResponse = groupData.map(workingTime);

    return res.status(STATUS_CODE.SUCCESS).send(lastResponse);
  } catch (error) {
    console.log(error);
  }
};

const getRecordsByQuery = (req: Request, records: any[]) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const { month = currentMonth, year = currentYear } = req.query;

  return records.filter((record: any) => {
    const date = new Date(record.time ?? record.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
};

const getReadableInfo = (records: any[]) => {
  return records.map((record: any) => {
    const recordTime = dayjs(record.time);
    return {
      day: recordTime.get("date"),
      time: recordTime.format("HH:mm"),
      type: record.type,
    };
  });
};

const filterLeaveRequest = (requests: any[]) => {
  const leaveRequestTypeValues = leaveRequestTypes.map((type) => type.value);

  return requests.filter((request) =>
    leaveRequestTypeValues.includes(request.type)
  );
};

const createGroupInfoByDay = (
  checkInOutData: any[],
  filteredLeaveRequests: any[]
) => {
  const infoMap = new Map();
  checkInOutData.forEach((item: any) => {
    const { day, type, time } = item;
    if (type === 0) {
      infoMap.set(
        day,
        Object.assign(infoMap.get(day) || {}, {
          checkin: time,
          day,
        })
      );
    } else {
      infoMap.set(
        day,
        Object.assign(infoMap.get(day) || {}, {
          checkout: time,
          day,
        })
      );
    }
  });

  filteredLeaveRequests.forEach((item: any) => {
    const { type, date, status, isCancelled, reason } = item;
    if (status === REQUEST_STATUS.ACCEPTED.value && !isCancelled) {
      const day = dayjs(date).get("date");
      infoMap.set(
        day,
        Object.assign(infoMap.get(day) || {}, {
          requestType: type,
          reason,
          day,
        })
      );
    }
  });
  const groupData = Array.from(infoMap.values());
  return groupData;
};

const workingTime = (attendanceInfo: any) => {
  const {
    checkin = "",
    checkout = "",
    day = "",
    requestType = "",
    reason = "",
  } = attendanceInfo;

  let workingMinute = 0;
  if (checkin && checkout) {
    const checkinTargetTime = getTargetTime(checkin);
    const checkoutTargetTime = getTargetTime(checkout);
    if (
      checkinTargetTime === TARGET_TIME.IN_MORNING &&
      checkoutTargetTime === TARGET_TIME.IN_AFTERNOON
    ) {
      workingMinute = getDiffMinute(checkout, checkin) - getRestDuration();
    } else if (
      checkinTargetTime === TARGET_TIME.IN_MORNING &&
      checkinTargetTime === TARGET_TIME.IN_REST
    ) {
      workingMinute = getDiffMinute(WORKING_TIME.MORNING_END, checkin);
    } else if (
      checkinTargetTime === TARGET_TIME.IN_REST &&
      checkinTargetTime === TARGET_TIME.IN_AFTERNOON
    ) {
      workingMinute = getDiffMinute(checkout, WORKING_TIME.AFTERNOON_START);
    } else {
      if (checkinTargetTime === checkoutTargetTime) {
        if (
          checkinTargetTime === TARGET_TIME.IN_MORNING ||
          checkinTargetTime === TARGET_TIME.IN_AFTERNOON
        ) {
          workingMinute = getDiffMinute(checkout, checkin);
        } else {
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

const getWorkingHour = (workingMinute: number) => {
  const hours = workingMinute / 60;
  const minutes = workingMinute % 60;
  return dayjs().hour(hours).minute(minutes).format("HH:mm");
};

const getTargetTime = (timeString: string) => {
  const diffMorningEnd = getDiffMinute(WORKING_TIME.MORNING_END, timeString);
  const diffAfternoonStart = getDiffMinute(
    WORKING_TIME.AFTERNOON_START,
    timeString
  );
  if (diffMorningEnd >= 0) return TARGET_TIME.IN_MORNING;
  else {
    if (diffAfternoonStart >= 0) {
      return TARGET_TIME.IN_REST;
    } else {
      return TARGET_TIME.IN_AFTERNOON;
    }
  }
};

const getRestDuration = () => {
  return getDiffMinute(WORKING_TIME.AFTERNOON_START, WORKING_TIME.MORNING_END);
};

const getDiffMinute = (endTime: string, startTime: string) => {
  const [endHour, endMinute] = getSplitTime(endTime);
  const [startHour, startMinute] = getSplitTime(startTime);

  return (endHour - startHour) * 60 + (endMinute - startMinute);
};

const getSplitTime = (hourString: any) => {
  const [hour, minute] = hourString.split(":");
  return [Number(hour), Number(minute)];
};

export {
  checkInOut,
  getCheckInOutInfo,
  getCheckInOutList,
  getCheckInOutTimesheet,
};
