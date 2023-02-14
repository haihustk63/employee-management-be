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
exports.assignContestantTest = exports.getContestantTest = exports.updateContestantTest = exports.getContestantTests = exports.deleteTest = exports.updateTest = exports.getAllTests = exports.submitTest = exports.getTest = exports.saveTest = exports.createTest = exports.createTestRandom = void 0;
const client_1 = require("@prisma/client");
const mailtrap_1 = require("../../config/mailtrap");
const common_1 = require("../../constants/common");
const { CANDIDATE, EMPLOYEE, DIVISION_MANAGER, ADMIN, SUPER_ADMIN } = common_1.ROLES;
const { created, attempting, done } = common_1.TEST_STATUS;
const { essays, multipleChoice, oneChoice } = common_1.QUESTION_TYPES;
const prisma = new client_1.PrismaClient();
const createTestRandom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data: infoQuestion } = req.body;
        let transformInfo = [];
        infoQuestion.map((item) => {
            return Object.keys(item).map((key) => {
                if (key !== "topicId") {
                    transformInfo = [
                        ...transformInfo,
                        { topicId: item.topicId, level: key, amount: item[key] },
                    ];
                }
            });
        });
        const transformInfoFilter = transformInfo.filter((tr) => tr.amount);
        const reqPromises = transformInfoFilter.map((r) => prisma.$queryRaw `
          SELECT id, question_text AS questionText, question_source AS questionSource, options, \`type\`, answer 
          FROM test_question tq
          WHERE tq.topic_id = ${r.topicId} and tq.level = ${r.level}
          ORDER BY RAND() LIMIT ${r.amount}
          `);
        const test = yield Promise.all(reqPromises).then((data) => data.flat());
        return res.status(200).send(test);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.createTestRandom = createTestRandom;
const createTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data: questionIds } = req.body;
        const test = yield prisma.testQuestion.findMany({
            where: {
                id: {
                    in: questionIds,
                },
            },
        });
        return res.status(200).send(test);
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.createTest = createTest;
const saveTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const { questionIds, title, duration } = data;
        if (!title || !duration) {
            return res
                .status(400)
                .send({ message: "Title and duration must be provided" });
        }
        const newTest = yield prisma.skillTest.create({
            data: {
                title,
                duration,
                testQuestionSkillTest: {
                    create: questionIds.map((id) => ({
                        questionId: id,
                    })),
                },
            },
        });
        return res.status(201).send(newTest);
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.saveTest = saveTest;
const updateTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const { testId: id } = req.params;
        const { questionIds, title, duration } = data;
        const testId = Number(id);
        const questions = yield prisma.testQuestionSkillTest.findMany({
            where: {
                testId: testId,
            },
        });
        const oldQuestionIds = questions === null || questions === void 0 ? void 0 : questions.map((question) => question.questionId);
        const newIds = questionIds === null || questionIds === void 0 ? void 0 : questionIds.filter((id) => !oldQuestionIds.includes(id));
        const removeIds = oldQuestionIds === null || oldQuestionIds === void 0 ? void 0 : oldQuestionIds.filter((id) => !questionIds.includes(id));
        const removeRecords = prisma.testQuestionSkillTest.deleteMany({
            where: {
                questionId: {
                    in: removeIds,
                },
            },
        });
        const addRecords = prisma.testQuestionSkillTest.createMany({
            data: newIds === null || newIds === void 0 ? void 0 : newIds.map((id) => ({
                testId,
                questionId: id,
            })),
        });
        const updateTestInfo = prisma.skillTest.update({
            where: {
                id: testId,
            },
            data: {
                title,
                duration,
            },
        });
        yield prisma.$transaction([updateTestInfo, removeRecords, addRecords]);
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error.message);
        return res.sendStatus(400);
    }
});
exports.updateTest = updateTest;
const deleteTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testId } = req.params;
        yield prisma.skillTest.delete({
            where: {
                id: parseInt(testId),
            },
        });
        return res.sendStatus(200);
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.deleteTest = deleteTest;
const getTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testId } = req.params;
        const test = yield prisma.skillTest.findUnique({
            where: {
                id: Number(testId),
            },
            include: {
                testQuestionSkillTest: {
                    select: {
                        question: {
                            include: {
                                topic: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        questionId: true,
                    },
                },
                skillTestAccount: {
                    select: {
                        status: true,
                    },
                },
            },
        });
        return res.status(200).send({ test });
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.getTest = getTest;
const getAllTests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tests = yield prisma.skillTest.findMany({
            include: {
                testQuestionSkillTest: true,
                skillTestAccount: true,
            },
        });
        return res.status(200).send({ tests });
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.getAllTests = getAllTests;
const getContestantTests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = res.getHeader("email");
        const tests = yield prisma.skillTestAccount.findMany({
            where: {
                email,
            },
            include: {
                test: true,
                skillTestSessionAnswer: true,
            },
        });
        return res.status(200).send({ tests });
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.getContestantTests = getContestantTests;
const getContestantTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { testId: id } = req.params;
        const email = res.getHeader("email");
        const role = res.getHeader("role");
        const testId = Number(id);
        const includeAnswer = role === CANDIDATE.value ? false : true;
        const test = yield prisma.skillTestAccount.findUnique({
            where: {
                id: testId,
            },
            include: {
                test: {
                    include: {
                        testQuestionSkillTest: {
                            include: {
                                question: {
                                    select: {
                                        options: true,
                                        questionSource: true,
                                        questionText: true,
                                        type: true,
                                        answer: includeAnswer,
                                    },
                                },
                            },
                        },
                    },
                },
                skillTestSessionAnswer: {
                    include: {
                        question: true,
                    },
                },
                account: {
                    select: {
                        candidate: {
                            select: {
                                email: true,
                                name: true,
                                job: {
                                    select: {
                                        title: true,
                                    },
                                },
                            },
                        },
                        employee: {
                            select: {
                                firstName: true,
                                middleName: true,
                                lastName: true,
                                position: {
                                    select: {
                                        name: true,
                                    },
                                },
                                deliveryEmployee: {
                                    select: {
                                        delivery: {
                                            select: {
                                                name: true,
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
        if (role === CANDIDATE.value) {
            if ((test === null || test === void 0 ? void 0 : test.email) !== email) {
                return res.sendStatus(403);
            }
            else {
                if ((test === null || test === void 0 ? void 0 : test.status) === created.value) {
                    const responseData = {
                        id: test.id,
                        email: test.email,
                        status: test.status,
                    };
                    return res.status(200).send(responseData);
                }
                if ((test === null || test === void 0 ? void 0 : test.status) === done.value) {
                    const questionCount = test.test.testQuestionSkillTest.length;
                    const essayCount = (_a = test.test.testQuestionSkillTest.filter((item) => item.question.type === essays.value)) === null || _a === void 0 ? void 0 : _a.length;
                    const responseData = {
                        status: test.status,
                        score: test.score,
                        email: (_b = test.account.candidate) === null || _b === void 0 ? void 0 : _b.email,
                        questionCount,
                        essayCount,
                    };
                    return res.status(200).send(responseData);
                }
            }
        }
        if (role === EMPLOYEE.value || role === DIVISION_MANAGER.value) {
            if ((test === null || test === void 0 ? void 0 : test.email) !== email) {
                return res.sendStatus(403);
            }
        }
        return res.status(200).send(test);
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.getContestantTest = getContestantTest;
const assignContestantTest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, testId } = req.body.data || {};
    console.log(email, testId);
    if (!email || !testId) {
        return res.sendStatus(400);
    }
    const currentTest = yield prisma.skillTestAccount.findUnique({
        where: {
            email_testId: {
                testId,
                email,
            },
        },
    });
    if (!currentTest || (currentTest === null || currentTest === void 0 ? void 0 : currentTest.status) === created.value) {
        yield prisma.skillTestAccount.deleteMany({
            where: {
                email,
                status: created.value,
            },
        });
        yield prisma.skillTestAccount.create({
            data: {
                testId,
                email,
            },
        });
        return res.sendStatus(201);
    }
    if ((currentTest === null || currentTest === void 0 ? void 0 : currentTest.status) === attempting.value) {
        return res
            .status(400)
            .send({ message: "The candidate is currently attempting" });
    }
    if ((currentTest === null || currentTest === void 0 ? void 0 : currentTest.status) === done.value) {
        return res
            .status(400)
            .send({ message: "The candidate has done this test" });
    }
});
exports.assignContestantTest = assignContestantTest;
const updateContestantTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { confirmAttempt } = req.body.data || {};
        const { testId: id } = req.params;
        const email = res.getHeader("email");
        const testId = Number(id);
        const testAccount = yield prisma.skillTestAccount.findUnique({
            where: {
                id: testId,
            },
        });
        if ((testAccount === null || testAccount === void 0 ? void 0 : testAccount.email) !== email) {
            throw new Error("Not have the right");
        }
        if (confirmAttempt && (testAccount === null || testAccount === void 0 ? void 0 : testAccount.status) === created.value) {
            const updatedTest = yield prisma.skillTestAccount.update({
                where: {
                    id: testId,
                },
                data: {
                    status: attempting.value,
                },
                include: {
                    test: {
                        select: {
                            duration: true,
                        },
                    },
                },
            });
            const countdownTime = updatedTest.test.duration * 60 + 30;
            const timeout = setTimeout(() => {
                updateTestStatusJob(testId);
                clearTimeout(timeout);
            }, countdownTime * 1000);
            // const job = createJob(countdownTime, updateTestStatusJob(testId));
        }
        return res.sendStatus(200);
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.updateContestantTest = updateContestantTest;
const updateTestStatusJob = (testId) => __awaiter(void 0, void 0, void 0, function* () {
    const testAccount = yield prisma.skillTestAccount.findUnique({
        where: {
            id: testId,
        },
    });
    const currentStatus = testAccount === null || testAccount === void 0 ? void 0 : testAccount.status;
    if (currentStatus !== done.value) {
        yield prisma.skillTestAccount.update({
            where: {
                id: testId,
            },
            data: {
                status: done.value,
            },
        });
    }
});
const submitTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { testId, answers } = req.body.data;
        let score = 0;
        let email = res.getHeader("email");
        const role = res.getHeader("role");
        const currentTest = yield prisma.skillTestAccount.findUnique({
            where: {
                id: testId,
            },
        });
        if ((currentTest === null || currentTest === void 0 ? void 0 : currentTest.email) !== email) {
            return res.sendStatus(403);
        }
        const validAnswer = answers === null || answers === void 0 ? void 0 : answers.every((answer) => answer.sessionId === testId);
        if (!validAnswer) {
            return res.sendStatus(400);
        }
        if ((currentTest === null || currentTest === void 0 ? void 0 : currentTest.status) === done.value) {
            return res.sendStatus(400);
        }
        yield prisma.skillTestSessionAnswer.createMany({
            data: answers,
        });
        const submittedAnswers = yield prisma.skillTestSessionAnswer.findMany({
            where: {
                sessionId: testId,
            },
            include: {
                question: true,
            },
        });
        submittedAnswers.forEach((item) => {
            if (item.question.type !== essays.value) {
                const rightAnswer = item.question.answer;
                const userAnswer = item.answer;
                if (JSON.stringify(rightAnswer) === JSON.stringify(userAnswer)) {
                    score += 1;
                }
            }
        });
        yield prisma.skillTestAccount.update({
            where: {
                id: testId,
            },
            data: {
                score,
                status: done.value,
            },
        });
        if (role === CANDIDATE.value) {
            const account = yield prisma.employeeAccount.findUnique({
                where: {
                    email,
                },
                include: {
                    candidate: true,
                },
            });
            email = (_c = account === null || account === void 0 ? void 0 : account.candidate) === null || _c === void 0 ? void 0 : _c.email;
        }
        yield (0, mailtrap_1.sendEmail)({
            to: email,
            subject: "You have submitted the test successfully",
            text: "Congratulations! You have successfully submitted the test!",
        });
        return res.status(200).send("OK");
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.submitTest = submitTest;
