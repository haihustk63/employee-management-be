"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const dayjs_1 = __importDefault(require("dayjs"));
const createJob = (timeInSecond, cb) => {
    const target = (0, dayjs_1.default)(new Date()).add(timeInSecond, "second");
    const second = target.get("second");
    const minute = target.get("minute");
    const hour = target.get("hour");
    const date = target.get("date");
    const month = target.get("month") + 1;
    const formattedExpression = `${second} ${minute} ${hour} ${date} ${month} *`;
    const job = node_cron_1.default.schedule("formattedExpression", function () {
        // cb();
    });
    return job;
};
exports.createJob = createJob;
