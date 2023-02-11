"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const index_1 = require("@app/index");
const error_handler_1 = require("@middleware/error-handler");
const config_1 = require("./config");
const app = (0, express_1.default)();
const corsOption = {
    optionsSuccessStatus: 200,
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ],
    credentials: true,
};
// app.use(configResponseHeader);
app.use((0, cors_1.default)(corsOption));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(index_1.candidateApplyRouter, index_1.accountRouter, index_1.employeeProfileRouter, index_1.deliveryRouter, index_1.positionRouter, index_1.testTopicRouter, index_1.testQuestionRouter, index_1.constantRouter, index_1.loginRouter, index_1.testsRouter, index_1.checkInOutRouter, index_1.jobRouter, index_1.requestRouter, index_1.educationRouter, index_1.statisticsRouter, error_handler_1.errorHandler);
app.listen(config_1.appPort, () => {
    console.log(`Congratulation! App is listening on port ${config_1.appPort}`);
});
exports.default = app;
