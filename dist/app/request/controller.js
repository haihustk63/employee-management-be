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
exports.getRequests = exports.getOneRequest = exports.deleteRequest = exports.updateRequest = exports.createNewRequest = void 0;
const client_1 = require("@prisma/client");
const common_1 = require("../../constants/common");
const common_2 = require("../../constants/common");
const dayjs_1 = __importDefault(require("dayjs"));
const common_3 = require("../../constants/common");
const { ADMIN, SUPER_ADMIN, DIVISION_MANAGER, EMPLOYEE } = common_1.ROLES;
const leavingTypes = [
    common_3.REQUEST_TYPES.ANNUAL_AFTERNOON_LEAVE.value,
    common_3.REQUEST_TYPES.ANNUAL_LEAVE.value,
    common_3.REQUEST_TYPES.ANNUAL_MORNING_LEAVE.value,
    common_3.REQUEST_TYPES.UNPAID_MORNING_LEAVE.value,
    common_3.REQUEST_TYPES.UNPAID_AFTERNOON_LEAVE.value,
    common_3.REQUEST_TYPES.UNPAID_LEAVE.value,
];
const checkInOutTypes = [
    common_3.REQUEST_TYPES.MODIFY_CHECKIN.value,
    common_3.REQUEST_TYPES.MODIFY_CHECKOUT.value,
];
const prisma = new client_1.PrismaClient();
const undefinedItem = "X";
const createNewRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const { date, type } = data;
        const { id: employeeId } = res.getHeader("user");
        const hasSameTypeRequest = yield checkSameTypeRequest({
            employeeId,
            type,
            date,
        });
        if (hasSameTypeRequest) {
            return res.status(400).send({
                message: "There is another same request on that day. Please cancel it before create a new one",
            });
        }
        const newRequest = yield prisma.request.create({
            data: Object.assign(Object.assign({}, data), { employeeId }),
        });
        return res.status(200).send(newRequest);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.createNewRequest = createNewRequest;
const checkSameTypeRequest = ({ employeeId, type, date }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let typeSearch = leavingTypes.includes(type) ? { in: leavingTypes } : type;
    const sameTypeRequest = yield prisma.request.findMany({
        where: {
            employeeId,
            type: typeSearch,
            date: {
                equals: new Date((0, dayjs_1.default)(date).format("YYYY-MM-DD")),
            },
        },
    });
    let checked;
    if (!checkInOutTypes.includes(type)) {
        checked = (_a = sameTypeRequest.filter((request) => {
            return (request.status !== common_2.REQUEST_STATUS.REJECTED.value ||
                (request.status === common_2.REQUEST_STATUS.REJECTED.value &&
                    request.isCancelled));
        })) === null || _a === void 0 ? void 0 : _a.length;
    }
    else {
        checked = (_b = sameTypeRequest.filter((request) => request.status === common_2.REQUEST_STATUS.PENDING.value)) === null || _b === void 0 ? void 0 : _b.length;
    }
    if (checked) {
        return true;
    }
    return false;
});
const getRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = res.getHeader("role");
        const { id: employeeId } = res.getHeader("user");
        const { page = 1, limit = 10 } = req.query;
        const requests = yield getRequestsWithParams({
            query: req.query,
            role,
            employeeId,
            withLimit: true,
        });
        const requestsWithoutLimit = yield getRequestsWithParams({
            query: req.query,
            role,
            employeeId,
            withLimit: false,
        });
        const response = {
            data: requests,
            total: requestsWithoutLimit === null || requestsWithoutLimit === void 0 ? void 0 : requestsWithoutLimit.length,
            page: +page,
            limit: +limit,
        };
        return res.status(200).send(response);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.getRequests = getRequests;
const getRequestsWithParams = ({ query, role, employeeId, withLimit, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { keyword, type, status, page = 1, limit = 10, dateSort, lastNameSort, } = query;
    const orderBy = {};
    const pageParams = withLimit
        ? {
            take: +limit,
            skip: (+page - 1) * +limit,
        }
        : {};
    const whereExtraQuery = {};
    if (dateSort) {
        orderBy.date = +dateSort === common_1.SORT_ORDER.ascend.value ? "asc" : "desc";
    }
    if (lastNameSort && role !== EMPLOYEE.value) {
        orderBy.employee = {
            lastName: +lastNameSort === common_1.SORT_ORDER.ascend.value ? "asc" : "desc",
        };
    }
    if (keyword) {
        whereExtraQuery.OR = [
            {
                employee: {
                    OR: [
                        {
                            lastName: {
                                contains: keyword,
                            },
                        },
                        {
                            middleName: {
                                contains: keyword,
                            },
                        },
                        {
                            firstName: {
                                contains: keyword,
                            },
                        },
                    ],
                },
            },
            {
                reason: {
                    contains: keyword,
                },
            },
        ];
    }
    if (type) {
        whereExtraQuery.type = {
            equals: +type,
        };
    }
    if (status) {
        whereExtraQuery.status = {
            equals: +status,
        };
    }
    if (role === EMPLOYEE.value) {
        return yield prisma.request.findMany({
            where: {
                employeeId,
            },
            orderBy: orderBy,
        });
    }
    else if (role === DIVISION_MANAGER.value) {
        const currentEmployee = yield prisma.employee.findUnique({
            where: {
                id: employeeId,
            },
            select: {
                deliveryEmployee: {
                    select: {
                        deliveryId: true,
                    },
                },
            },
        });
        return prisma.request.findMany(Object.assign({ where: Object.assign({ employee: {
                    deliveryEmployee: {
                        deliveryId: (_c = currentEmployee === null || currentEmployee === void 0 ? void 0 : currentEmployee.deliveryEmployee) === null || _c === void 0 ? void 0 : _c.deliveryId,
                    },
                } }, whereExtraQuery), include: {
                employee: {
                    select: {
                        lastName: true,
                        firstName: true,
                        middleName: true,
                    },
                },
            }, orderBy: orderBy }, pageParams));
    }
    else {
        return prisma.request.findMany(Object.assign({ where: whereExtraQuery, include: {
                employee: {
                    select: {
                        lastName: true,
                        firstName: true,
                        middleName: true,
                    },
                },
            }, orderBy: orderBy }, pageParams));
    }
});
const updateRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g, _h, _j;
    try {
        const { status, isCancelled } = req.body.data || {};
        const { requestId: id } = req.params;
        const role = res.getHeader("role");
        const email = res.getHeader("email");
        const requestId = Number(id);
        if (status === undefined && isCancelled === undefined) {
            return res.sendStatus(400);
        }
        const request = yield prisma.request.findUnique({
            where: {
                id: requestId,
            },
            include: {
                employee: {
                    select: {
                        employeeAccount: {
                            select: {
                                email: true,
                                employee: {
                                    select: {
                                        deliveryEmployee: {
                                            select: {
                                                deliveryId: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (isCancelled) {
            const requestEmail = (_d = request === null || request === void 0 ? void 0 : request.employee.employeeAccount) === null || _d === void 0 ? void 0 : _d.email;
            if (requestEmail !== email) {
                return res.sendStatus(403);
            }
            if (!(request === null || request === void 0 ? void 0 : request.isAdminReviewed)) {
                yield prisma.request.delete({
                    where: {
                        id: requestId,
                    },
                });
                return res.sendStatus(200);
            }
            if (request === null || request === void 0 ? void 0 : request.isAdminReviewed) {
                if (request.type === common_3.REQUEST_TYPES.MODIFY_CHECKIN.value ||
                    request.type === common_3.REQUEST_TYPES.MODIFY_CHECKOUT.value) {
                    return res
                        .status(400)
                        .send({ message: "Please create another request" });
                }
                else if (request.status === common_2.REQUEST_STATUS.REJECTED.value) {
                    return res.status(400).send({
                        message: "Can not cancel because this request is rejected",
                    });
                }
                else if (request.status === common_2.REQUEST_STATUS.ACCEPTED.value &&
                    !request.isCancelled) {
                    yield prisma.request.update({
                        where: {
                            id: requestId,
                        },
                        data: {
                            isCancelled: true,
                            status: common_2.REQUEST_STATUS.PENDING.value,
                        },
                    });
                    return res.sendStatus(200);
                }
                else {
                    return res.sendStatus(400);
                }
            }
        }
        if (status !== undefined) {
            if (role === EMPLOYEE.value) {
                return res.sendStatus(403);
            }
            if (role === DIVISION_MANAGER.value) {
                const currentAccount = yield prisma.employeeAccount.findUnique({
                    where: {
                        email: email,
                    },
                    select: {
                        employee: {
                            select: {
                                deliveryEmployee: {
                                    select: {
                                        deliveryId: true,
                                    },
                                },
                            },
                        },
                    },
                });
                if (((_g = (_f = (_e = request === null || request === void 0 ? void 0 : request.employee.employeeAccount) === null || _e === void 0 ? void 0 : _e.employee) === null || _f === void 0 ? void 0 : _f.deliveryEmployee) === null || _g === void 0 ? void 0 : _g.deliveryId) !==
                    ((_j = (_h = currentAccount === null || currentAccount === void 0 ? void 0 : currentAccount.employee) === null || _h === void 0 ? void 0 : _h.deliveryEmployee) === null || _j === void 0 ? void 0 : _j.deliveryId)) {
                    return res.sendStatus(403);
                }
            }
            if (status === common_2.REQUEST_STATUS.ACCEPTED.value &&
                (request === null || request === void 0 ? void 0 : request.isCancelled) &&
                !checkInOutTypes.includes(request.type)) {
                yield prisma.request.delete({
                    where: {
                        id: requestId,
                    },
                });
                return res.sendStatus(200);
            }
            if (((request === null || request === void 0 ? void 0 : request.type) === common_3.REQUEST_TYPES.MODIFY_CHECKIN.value ||
                (request === null || request === void 0 ? void 0 : request.type) === common_3.REQUEST_TYPES.MODIFY_CHECKOUT.value) &&
                status === common_2.REQUEST_STATUS.ACCEPTED.value) {
                yield updateCheckInOut({ request, type: request.type });
            }
            yield prisma.request.update({
                where: {
                    id: requestId,
                },
                data: {
                    status,
                    isAdminReviewed: true,
                },
            });
        }
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.updateRequest = updateRequest;
const updateCheckInOut = ({ request, type }) => __awaiter(void 0, void 0, void 0, function* () {
    var _k, _l, _m;
    const duration = request.duration;
    const [hour, minute] = (_m = (_l = (_k = duration === null || duration === void 0 ? void 0 : duration.split("-")) === null || _k === void 0 ? void 0 : _k.filter((part) => part !== undefinedItem)) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.split(":");
    const newTime = (0, dayjs_1.default)(request.date).hour(hour).minute(minute).toDate();
    const typeCheckInOut = type === common_3.REQUEST_TYPES.MODIFY_CHECKIN.value
        ? common_1.CHECK_IN_OUT_TYPE.checkin.value
        : common_1.CHECK_IN_OUT_TYPE.checkout.value;
    const data = yield prisma.checkInOut.findFirst({
        where: {
            employeeId: request.employeeId,
            type: typeCheckInOut,
            time: {
                gte: new Date((0, dayjs_1.default)(request.date).format("YYYY-MM-DD")),
                lt: new Date((0, dayjs_1.default)(request.date).add(1, "day").format("YYYY-MM-DD")),
            },
        },
    });
    if (data) {
        yield prisma.checkInOut.update({
            where: {
                id: data.id,
            },
            data: {
                time: newTime,
            },
        });
    }
    else {
        yield prisma.checkInOut.create({
            data: {
                employeeId: request.employeeId,
                time: newTime,
                type: typeCheckInOut,
            },
        });
    }
});
const deleteRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId } = req.params;
        yield prisma.request.delete({
            where: {
                id: Number(requestId),
            },
        });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.deleteRequest = deleteRequest;
const getOneRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId } = req.params;
        const request = yield prisma.request.findUnique({
            where: {
                id: Number(requestId),
            },
        });
        return res.status(200).send(request);
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.getOneRequest = getOneRequest;
