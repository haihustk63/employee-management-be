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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDelivery = exports.updateDelivery = exports.getAllDeliveries = exports.createNewDelivery = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createNewDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const { name, description, managerId } = data;
        const newDelivery = yield prisma.delivery.create({
            data: {
                name,
                description,
            },
        });
        if (managerId) {
            const deliveryId = newDelivery.id;
            yield prisma.deliveryEmployee.create({
                data: {
                    deliveryId,
                    employeeId: managerId,
                    isManager: true,
                },
            });
        }
        return res.status(200).send({ newDelivery });
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.createNewDelivery = createNewDelivery;
const updateDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const { deliveryId } = req.params;
        const { name, description, managerId } = data;
        const updatedDelivery = yield prisma.delivery.update({
            where: {
                id: Number(deliveryId),
            },
            data: {
                name,
                description,
            },
        });
        if (managerId) {
            // Find the record with term "managerId"
            const findRecordWithManagerId = yield prisma.deliveryEmployee.findUnique({
                where: {
                    employeeId: managerId,
                },
            });
            // If found
            if (findRecordWithManagerId) {
                // If the current role with that id is not manager
                if (!(findRecordWithManagerId === null || findRecordWithManagerId === void 0 ? void 0 : findRecordWithManagerId.isManager)) {
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
                    // Change the current employee's role with that managerId is manager
                    yield prisma.deliveryEmployee.update({
                        where: {
                            employeeId: managerId,
                        },
                        data: {
                            isManager: true,
                        },
                    });
                }
            }
            else {
                // If not found
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
                // Create new record
                yield prisma.deliveryEmployee.create({
                    data: {
                        employeeId: managerId,
                        deliveryId: Number(deliveryId),
                        isManager: true,
                    },
                });
            }
        }
        return res.status(200).send({ updatedDelivery });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.updateDelivery = updateDelivery;
const getAllDeliveries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allDeliveries = yield prisma.delivery.findMany({
            include: {
                deliveryEmployee: {
                    where: {
                        isManager: true,
                    },
                    include: {
                        employee: {
                            select: {
                                firstName: true,
                                middleName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
        return res.status(200).send({ allDeliveries });
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.getAllDeliveries = getAllDeliveries;
const deleteDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deliveryId } = req.params;
        yield prisma.delivery.delete({
            where: {
                id: Number(deliveryId),
            },
        });
        return res.sendStatus(200);
    }
    catch (error) {
        return res.status(400).send(error.message);
    }
});
exports.deleteDelivery = deleteDelivery;
