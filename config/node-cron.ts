import nodeCron from "node-cron";
import dayjs from "dayjs";

export const createJob = (timeInSecond: number, cb: any) => {
  const target = dayjs(new Date()).add(timeInSecond, "second");
  const second = target.get("second");
  const minute = target.get("minute");
  const hour = target.get("hour");
  const date = target.get("date");
  const month = target.get("month") + 1;
  const formattedExpression = `${second} ${minute} ${hour} ${date} ${month} *`;
  const job = nodeCron.schedule("formattedExpression", function () {
    // cb();
  });
  return job;
};
