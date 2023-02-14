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
exports.deleteEmployeeProfile = exports.updateEmployeeProfile = exports.createManyEmployeeProfile = exports.createNewEmployeeProfile = exports.getOneEmployeeProfile = exports.getAllEmployeeProfile = void 0;
const client_1 = require("@prisma/client");
const common_1 = require("../../constants/common");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const roleAdmin = [common_1.ROLES.ADMIN.value, common_1.ROLES.SUPER_ADMIN.value];
const prisma = new client_1.PrismaClient();
const getAllEmployeeProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { limit = 10, page = 1 } = req.query;
    const employees = yield getEmployeeWithParams(req.query, true);
    const employeesWithoutLimit = yield getEmployeeWithParams(req.query, false);
    const result = {
        page: +page,
        limit: +limit,
        data: employees,
        total: employeesWithoutLimit === null || employeesWithoutLimit === void 0 ? void 0 : employeesWithoutLimit.length,
    };
    return res.status(200).send(result);
});
exports.getAllEmployeeProfile = getAllEmployeeProfile;
const getEmployeeWithParams = (query, withLimit) => {
    let { delivery, keyword, position, role, workingStatus, limit = 10, page = 1, lastNameSort, joinDateSort, } = query;
    return prisma.$queryRaw `
  SELECT ee.id, first_name as firstName, middle_name as middleName, last_name as lastName,
  phone_number as phoneNumber, date_of_birth as dateOfBirth, join_date as joinDate, role,
  paid_leave_count as paidLeaveCount, working_status as workingStatus, avatar, email, 
  delivery_id as deliveryId, is_manager as isManager, dy.name as deliveryName, 
  position_id as positionId, po.name as positionName
  FROM employee as ee
  LEFT JOIN employee_account AS ea ON ee.id = ea.employee_id
  LEFT JOIN delivery_employee AS de ON ee.id = de.employee_id
  LEFT JOIN delivery AS dy ON de.delivery_id = dy.id
  LEFT JOIN position AS po ON po.id = ee.position_id
  WHERE 1
  ${keyword
        ? client_1.Prisma.sql `AND first_name LIKE ${`%${keyword}%`} 
      OR last_name LIKE ${`%${keyword}%`} 
      OR middle_name LIKE ${`%${keyword}%`} 
      OR phone_number LIKE ${`%${keyword}%`} 
      OR email LIKE ${`%${keyword}%`}`
        : client_1.Prisma.empty}
  ${delivery ? client_1.Prisma.sql `AND delivery_id = ${+delivery}` : client_1.Prisma.empty}
  ${position ? client_1.Prisma.sql `AND position_id = ${+position}` : client_1.Prisma.empty}
  ${role ? client_1.Prisma.sql `AND role = ${+role}` : client_1.Prisma.empty}
  ${workingStatus
        ? client_1.Prisma.sql `AND working_status = ${+workingStatus}`
        : client_1.Prisma.empty}
  ${workingStatus
        ? client_1.Prisma.sql `AND working_status = ${+workingStatus}`
        : client_1.Prisma.empty}
  ${lastNameSort
        ? +lastNameSort === common_1.SORT_ORDER.ascend.value
            ? client_1.Prisma.sql `ORDER BY last_name ASC`
            : client_1.Prisma.sql `ORDER BY last_name DESC`
        : client_1.Prisma.empty}
  ${joinDateSort
        ? +joinDateSort === common_1.SORT_ORDER.ascend.value
            ? client_1.Prisma.sql `ORDER BY join_date ASC`
            : client_1.Prisma.sql `ORDER BY join_date DESC`
        : client_1.Prisma.empty}
  ${withLimit && limit ? client_1.Prisma.sql `LIMIT ${limit}` : client_1.Prisma.empty}
    ${withLimit && page && limit
        ? client_1.Prisma.sql `OFFSET ${(+page - 1) * +limit}`
        : client_1.Prisma.empty}
  `;
};
const getOneEmployeeProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeeId } = req.params;
        const employeeProfile = yield prisma.employee.findUnique({
            where: {
                id: Number(employeeId),
            },
            include: {
                deliveryEmployee: {
                    select: {
                        isManager: true,
                        delivery: {
                            select: {
                                name: true,
                                description: true,
                                id: true,
                            },
                        },
                    },
                },
                employeeAccount: {
                    select: {
                        email: true,
                    },
                },
            },
        });
        return res.status(200).send({ employeeProfile });
    }
    catch (error) {
        return res.status(400).send({ error });
    }
});
exports.getOneEmployeeProfile = getOneEmployeeProfile;
const createNewEmployeeProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = JSON.parse(req.body.data);
        const deliveryId = data === null || data === void 0 ? void 0 : data.deliveryId;
        const email = data === null || data === void 0 ? void 0 : data.email;
        const isManager = (data === null || data === void 0 ? void 0 : data.role) === common_1.ROLES.DIVISION_MANAGER.value;
        let profileData = Object.assign({}, data);
        profileData === null || profileData === void 0 ? true : delete profileData.deliveryId;
        profileData === null || profileData === void 0 ? true : delete profileData.email;
        if (req.file) {
            const avatarUrl = yield cloudinary_1.default.normal({
                file: req.file,
                folder: common_1.UPCLOUD_FOLDERS.avatars,
            });
            profileData = Object.assign(Object.assign({}, profileData), { avatar: avatarUrl });
        }
        const newEmployeeProfile = yield prisma.employee.create({
            data: profileData,
        });
        if (email) {
            yield prisma.employeeAccount.update({
                data: {
                    employeeId: newEmployeeProfile.id,
                },
                where: {
                    email,
                },
            });
        }
        if (deliveryId) {
            if (isManager) {
                // Change the current manager of that delivery -> not manager
                yield prisma.deliveryEmployee.updateMany({
                    where: {
                        deliveryId: Number(deliveryId),
                        isManager: true,
                    },
                    data: {
                        isManager: false,
                    },
                });
            }
            yield prisma.deliveryEmployee.create({
                data: {
                    employeeId: newEmployeeProfile.id,
                    deliveryId,
                    isManager,
                },
            });
        }
        return res.status(200).send({ newEmployeeProfile });
    }
    catch (error) {
        return res.status(400).send({ error });
    }
});
exports.createNewEmployeeProfile = createNewEmployeeProfile;
const createManyEmployeeProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const newEmployeeProfile = yield prisma.employee.createMany({ data });
        return res.status(200).send({ newEmployeeProfile });
    }
    catch (error) {
        return res.status(400).send({ error });
    }
});
exports.createManyEmployeeProfile = createManyEmployeeProfile;
const updateEmployeeProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { role } = res.getHeader("user");
        const { employeeId } = req.params;
        const data = JSON.parse(req.body.data);
        const deliveryId = data === null || data === void 0 ? void 0 : data.deliveryId;
        const email = data === null || data === void 0 ? void 0 : data.email;
        const isManager = (data === null || data === void 0 ? void 0 : data.role) === common_1.ROLES.DIVISION_MANAGER.value;
        let profileData = Object.assign({}, data);
        profileData === null || profileData === void 0 ? true : delete profileData.deliveryId;
        profileData === null || profileData === void 0 ? true : delete profileData.email;
        if (req.file) {
            const avatarUrl = yield cloudinary_1.default.normal({
                file: req.file,
                folder: common_1.UPCLOUD_FOLDERS.avatars,
            });
            profileData = Object.assign(Object.assign({}, profileData), { avatar: avatarUrl.url });
        }
        if (profileData.role) {
            if (profileData.role === common_1.ROLES.SUPER_ADMIN.value ||
                (profileData.role === common_1.ROLES.ADMIN.value &&
                    role !== common_1.ROLES.SUPER_ADMIN.value) ||
                (!roleAdmin.includes(profileData.role) && !roleAdmin.includes(role))) {
                return res.sendStatus(403);
            }
        }
        const updatedEmployeeProfile = yield prisma.employee.update({
            where: {
                id: Number(employeeId),
            },
            data: profileData,
            select: {
                employeeAccount: {
                    select: {
                        email: true,
                        candidateId: true,
                        employeeId: true,
                    },
                },
            },
        });
        if (email && ((_a = updatedEmployeeProfile.employeeAccount) === null || _a === void 0 ? void 0 : _a.email) !== email) {
            const accountOfEmail = yield prisma.employeeAccount.findUnique({
                where: {
                    email,
                },
            });
            if (accountOfEmail === null || accountOfEmail === void 0 ? void 0 : accountOfEmail.employeeId) {
                if ((accountOfEmail === null || accountOfEmail === void 0 ? void 0 : accountOfEmail.employeeId) !== Number(employeeId)) {
                    return res
                        .status(400)
                        .send({ message: "This account has been assigned to a employee" });
                }
            }
            else {
                yield prisma.employeeAccount.update({
                    where: {
                        email: (_b = updatedEmployeeProfile.employeeAccount) === null || _b === void 0 ? void 0 : _b.email,
                    },
                    data: {
                        employeeId: null,
                    },
                });
                yield prisma.employeeAccount.update({
                    where: {
                        email,
                    },
                    data: {
                        employeeId: Number(employeeId),
                    },
                });
            }
        }
        // Check if deliveryId is sent
        if (deliveryId) {
            // If yes, check if the employee existed
            const findRecordWithManagerId = yield prisma.deliveryEmployee.findUnique({
                where: {
                    employeeId: Number(employeeId),
                },
            });
            // If yes
            if (findRecordWithManagerId) {
                // Case move the employee to another delivery
                if (deliveryId !== findRecordWithManagerId.deliveryId) {
                    if (isManager) {
                        // So first of all, update all roles of "another delivery" => not manager
                        yield prisma.deliveryEmployee.updateMany({
                            where: {
                                deliveryId,
                                isManager: true,
                            },
                            data: {
                                isManager: false,
                            },
                        });
                        // Assign role manager for that employee
                        yield prisma.deliveryEmployee.update({
                            where: {
                                employeeId: Number(employeeId),
                            },
                            data: {
                                deliveryId,
                                isManager: true,
                            },
                        });
                    }
                    else {
                        // Move employee to another delivery but his role is not manager
                        yield prisma.deliveryEmployee.update({
                            where: {
                                employeeId: Number(employeeId),
                            },
                            data: {
                                deliveryId,
                                isManager: false,
                            },
                        });
                    }
                }
                else {
                    // Still be in the same delivery
                    if (findRecordWithManagerId.isManager !== isManager) {
                        if (isManager) {
                            yield prisma.deliveryEmployee.updateMany({
                                where: {
                                    deliveryId,
                                },
                                data: {
                                    isManager: false,
                                },
                            });
                            yield prisma.deliveryEmployee.update({
                                where: {
                                    employeeId: Number(employeeId),
                                },
                                data: {
                                    isManager: true,
                                },
                            });
                        }
                        else {
                            yield prisma.deliveryEmployee.update({
                                where: {
                                    employeeId: Number(employeeId),
                                },
                                data: {
                                    isManager: false,
                                },
                            });
                        }
                    }
                }
            }
            else {
                // If not find any records with "employeeId" => create new
                if (isManager) {
                    yield prisma.deliveryEmployee.updateMany({
                        where: {
                            deliveryId,
                        },
                        data: {
                            isManager: false,
                        },
                    });
                }
                yield prisma.deliveryEmployee.create({
                    data: {
                        employeeId: Number(employeeId),
                        deliveryId,
                        isManager: false,
                    },
                });
            }
        }
        return res.status(200).send({ updatedEmployeeProfile });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ error });
    }
});
exports.updateEmployeeProfile = updateEmployeeProfile;
const deleteEmployeeProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeeId } = req.params;
        yield prisma.employee.delete({
            where: { id: Number(employeeId) },
        });
        return res.sendStatus(200);
    }
    catch (error) {
        return res.status(400).send({ error });
    }
});
exports.deleteEmployeeProfile = deleteEmployeeProfile;
