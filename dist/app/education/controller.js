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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateEducationProgram = exports.unJoinEducationProgram = exports.joinEducationProgram = exports.deleteEducationProgram = exports.updateEducationProgram = exports.getEducationProgramById = exports.getMyEducationPrograms = exports.getAllEducationPrograms = exports.createEducationProgram = void 0;
const cloudinary_1 = __importDefault(require("@config/cloudinary"));
const common_1 = require("@constants/common");
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
const createEducationProgram = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = JSON.parse(req.body.data);
        const _b = data || {}, { tutorId = "" } = _b, rest = __rest(_b, ["tutorId"]);
        let dataToSave = Object.assign({}, rest);
        if (req.files) {
            const uploadTasks = (_a = req.files) === null || _a === void 0 ? void 0 : _a.map((file) => {
                return cloudinary_1.default.useConvert({
                    file,
                    folder: common_1.UPCLOUD_FOLDERS.educationMaterials,
                });
            });
            const uploadedItems = yield Promise.all(uploadTasks);
            const materialUrls = uploadedItems.map((item) => item.url);
            dataToSave = Object.assign(Object.assign({}, dataToSave), { materials: materialUrls });
        }
        const newProgram = yield prisma.educationProgram.create({
            data: dataToSave,
        });
        if (tutorId) {
            yield prisma.employeeEducation.create({
                data: {
                    employeeId: Number(tutorId),
                    isTutor: true,
                    programId: newProgram.id,
                },
            });
        }
        return res.status(200).send(newProgram);
    }
    catch (err) {
        next(err);
    }
});
exports.createEducationProgram = createEducationProgram;
const getAllEducationPrograms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const programs = yield prisma.educationProgram.findMany({
            include: {
                employees: {
                    select: {
                        isTutor: true,
                        rate: true,
                        employee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                            },
                        },
                    },
                },
            },
        });
        const resPrograms = transformPrograms(programs);
        return res.status(200).send({ allPrograms: resPrograms });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllEducationPrograms = getAllEducationPrograms;
const getMyEducationPrograms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: employeeId } = res.getHeader("user");
        const records = yield prisma.employeeEducation.findMany({
            where: {
                employeeId,
            },
            include: {
                program: {
                    include: {
                        employees: {
                            select: {
                                isTutor: true,
                                rate: true,
                                employee: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        middleName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const myPrograms = records.map((record) => record.program);
        const resPrograms = transformPrograms(myPrograms);
        return res.status(200).send({ allPrograms: resPrograms });
    }
    catch (err) {
        next(err);
    }
});
exports.getMyEducationPrograms = getMyEducationPrograms;
const transformPrograms = (programs) => {
    return programs === null || programs === void 0 ? void 0 : programs.map((item) => {
        var _a;
        const { employees, time, duration } = item, rest = __rest(item, ["employees", "time", "duration"]);
        const tutor = (_a = employees === null || employees === void 0 ? void 0 : employees.find((employee) => employee.isTutor)) === null || _a === void 0 ? void 0 : _a.employee;
        const averageRate = calculateAverageRate(employees);
        const endTime = (0, dayjs_1.default)(time).add(duration, "minutes");
        return Object.assign({ employees, tutor, time, duration, endTime, averageRate }, rest);
    });
};
const calculateAverageRate = (employees) => {
    let totalTurns = 0;
    let totalStars = 0;
    employees.forEach((employee) => {
        const { rate } = employee;
        if (rate !== null) {
            totalStars += employee.rate;
            totalTurns += 1;
        }
    });
    return !totalTurns ? 5 : totalStars / totalTurns;
};
const getEducationProgramById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { programId } = req.params;
        if (!programId) {
            return res.sendStatus(400);
        }
        const program = yield prisma.educationProgram.findUnique({
            where: {
                id: Number(programId),
            },
            include: {
                employees: {
                    select: {
                        isTutor: true,
                        rate: true,
                        employee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                middleName: true,
                            },
                        },
                    },
                },
            },
        });
        const employees = program === null || program === void 0 ? void 0 : program.employees;
        const tutor = (_c = employees === null || employees === void 0 ? void 0 : employees.find((employee) => employee.isTutor)) === null || _c === void 0 ? void 0 : _c.employee;
        return res.status(200).send(Object.assign(Object.assign({}, program), { tutor }));
    }
    catch (err) {
        next(err);
    }
});
exports.getEducationProgramById = getEducationProgramById;
const updateEducationProgram = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const { programId: id } = req.params;
        const programId = parseInt(id);
        const data = JSON.parse(req.body.data);
        const _e = data || {}, { tutorId = "", deleteMaterialList = [] } = _e, rest = __rest(_e, ["tutorId", "deleteMaterialList"]);
        let dataToSave = Object.assign({}, rest);
        let newMaterials = [];
        const program = yield prisma.educationProgram.findUnique({
            where: {
                id: programId,
            },
        });
        const currentMaterials = program === null || program === void 0 ? void 0 : program.materials;
        newMaterials = currentMaterials === null || currentMaterials === void 0 ? void 0 : currentMaterials.filter((item) => !deleteMaterialList.includes(item));
        if (req.files) {
            const uploadTasks = (_d = req.files) === null || _d === void 0 ? void 0 : _d.map((file) => {
                return cloudinary_1.default.useConvert({
                    file,
                    folder: common_1.UPCLOUD_FOLDERS.educationMaterials,
                });
            });
            const uploadedItems = yield Promise.all(uploadTasks);
            const materialUrls = uploadedItems.map((item) => item.url);
            dataToSave = Object.assign(Object.assign({}, dataToSave), { materials: [...newMaterials, ...materialUrls] });
        }
        console.log(dataToSave);
        const updatedProgram = yield prisma.educationProgram.update({
            where: {
                id: Number(programId),
            },
            data: dataToSave,
        });
        const programTutor = yield prisma.employeeEducation.findFirst({
            where: {
                programId: Number(programId),
                isTutor: true,
            },
        });
        if (tutorId !== (programTutor === null || programTutor === void 0 ? void 0 : programTutor.employeeId)) {
            yield prisma.employeeEducation.deleteMany({
                where: {
                    programId: Number(programId),
                    isTutor: true,
                },
            });
            yield prisma.employeeEducation.upsert({
                where: {
                    employeeId_programId: {
                        programId: Number(programId),
                        employeeId: tutorId,
                    },
                },
                create: {
                    programId: Number(programId),
                    employeeId: tutorId,
                    isTutor: true,
                },
                update: {
                    isTutor: true,
                },
            });
        }
        return res.status(200).send(updatedProgram);
    }
    catch (err) {
        next(err);
    }
});
exports.updateEducationProgram = updateEducationProgram;
const deleteEducationProgram = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { programId } = req.params;
        yield prisma.educationProgram.delete({
            where: {
                id: Number(programId),
            },
        });
        return res.status(200).send("OK");
    }
    catch (err) {
        next(err);
    }
});
exports.deleteEducationProgram = deleteEducationProgram;
const joinEducationProgram = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const { programId } = data;
        const { id: employeeId } = res.getHeader("user");
        const program = yield prisma.educationProgram.findUnique({
            where: {
                id: programId,
            },
        });
        if ((0, dayjs_1.default)(program === null || program === void 0 ? void 0 : program.time).isBefore(Date.now())) {
            return res.sendStatus(400).send({ message: "Time to join is end" });
        }
        const record = yield prisma.employeeEducation.create({
            data: {
                employeeId,
                programId,
            },
        });
        return res.status(200).send(record);
    }
    catch (err) {
        next(err);
    }
});
exports.joinEducationProgram = joinEducationProgram;
const unJoinEducationProgram = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const { programId } = data;
        const { id: employeeId } = res.getHeader("user");
        yield prisma.employeeEducation.delete({
            where: {
                employeeId_programId: {
                    employeeId,
                    programId,
                },
            },
        });
        return res.status(200).send("OK");
    }
    catch (err) {
        next(err);
    }
});
exports.unJoinEducationProgram = unJoinEducationProgram;
const rateEducationProgram = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const { programId, rate } = data;
        const { id: employeeId } = res.getHeader("user");
        const record = yield prisma.employeeEducation.findUnique({
            where: {
                employeeId_programId: {
                    employeeId,
                    programId,
                },
            },
            include: {
                program: true,
            },
        });
        if (!record || typeof rate !== "number" || (rate * 10) % 5 !== 0) {
            return res.sendStatus(400);
        }
        const endTime = (0, dayjs_1.default)(record.program.time).add(record.program.duration);
        const canRate = endTime.isBefore(Date.now());
        if (canRate) {
            yield prisma.employeeEducation.update({
                where: {
                    employeeId_programId: {
                        employeeId,
                        programId,
                    },
                },
                data: {
                    rate,
                },
            });
            return res.sendStatus(200);
        }
        return res
            .status(400)
            .send({ message: "This program has not finished yet" });
    }
    catch (err) {
        next(err);
    }
});
exports.rateEducationProgram = rateEducationProgram;
