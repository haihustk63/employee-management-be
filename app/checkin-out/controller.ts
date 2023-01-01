import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { STATUS_CODE, WORKING_TIME } from "@constants/common";

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
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const { month = currentMonth, year = currentYear } = req.query;

    const records = await prisma.checkInOut.findMany({
      where: {
        // employeeId: Number(employeeId),
        employeeId: 1,
      },
    });

    const transformData = records
      .filter((record: any) => {
        const date = new Date(record.time);
        return date.getMonth() === month && date.getFullYear() === year;
      })
      .map((record: any) => {
        const recordTime = dayjs(record.time);
        return {
          day: recordTime.get("date"),
          time: recordTime.format("HH:mm"),
          type: record.type,
        };
      });

    const infoMap = new Map();
    transformData.map((item) => {
      const { day, type, time } = item;
      if (type === 0) {
        infoMap.set(
          day,
          Object.assign(infoMap.get(day) || {}, {
            checkin: time,
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

    const response = Array.from(infoMap.values());

    const lastResponse = response.map(workingTime);

    return res.status(STATUS_CODE.SUCCESS).send(lastResponse);
  } catch (error) {
    console.log(error);
  }
};

const workingTime = (attendanceInfo: any) => {
  const { checkin = "", checkout = "", day = "" } = attendanceInfo;
  const [inHour, inMinute] = getSplitTime(checkin);
  const [mHour, mMinute] = getSplitTime(WORKING_TIME.MORNING_END);
  const [outHour, outMinute] = getSplitTime(checkout);
  const [aHour, aMinute] = getSplitTime(WORKING_TIME.AFTERNOON_START);

  const minutesDiff =
    (mHour - inHour + outHour - aHour) * 60 +
    (mMinute - inMinute + outMinute - aMinute);

  const hours = Math.floor(minutesDiff / 60);
  const minutes = minutesDiff % 60;

  let workingHour = dayjs().hour(hours).minute(minutes).format("HH:mm");

  return {
    checkin,
    checkout,
    day,
    workingHour,
  };
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
