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
const common_1 = require("@constants/common");
const cloudinary_1 = __importDefault(require("@config/cloudinary"));
const roleAdmin = [common_1.ROLES.ADMIN.value, common_1.ROLES.SUPER_ADMIN.value];
const prisma = new client_1.PrismaClient();
const getAllEmployeeProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { delivery, keyword, position, role, workingStatus, joinDate } = req.query;
    const query = {
        deliveryEmployee: {
            deliveryId: Number(delivery),
        },
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
            {
                phoneNumber: {
                    contains: keyword,
                },
            },
        ],
        positionId: {
            equals: Number(position),
        },
        role: {
            equals: role,
        },
        workingStatus: {
            equals: workingStatus,
        },
    };
    if (!delivery) {
        delete query.deliveryEmployee;
    }
    if (!keyword) {
        delete query.OR;
    }
    if (!position) {
        delete query.positionId;
    }
    if (!role) {
        delete query.role;
    }
    if (!workingStatus) {
        delete query.workingStatus;
    }
    try {
        const allEmployeeProfile = yield prisma.employee.findMany({
            where: query,
            include: {
                deliveryEmployee: {
                    select: {
                        isManager: true,
                        delivery: {
                            select: {
                                name: true,
                                description: true,
                            },
                        },
                    },
                },
                employeeAccount: {
                    select: {
                        email: true,
                    },
                },
                position: true,
            },
        });
        return res.status(200).send({ allEmployeeProfile });
    }
    catch (error) {
        return res.status(400).send({ error });
    }
});
exports.getAllEmployeeProfile = getAllEmployeeProfile;
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
