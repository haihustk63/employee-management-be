"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_1 = require("../constants/common");
const index_1 = require("../constants/index");
const { CANDIDATE, ADMIN, SUPER_ADMIN } = common_1.ROLES;
const authMiddleware = (req, res, next) => {
    const { route: currentRoute, method } = req;
    if (index_1.NOT_NEED_AUTH_PATH.find((path) => path.route === currentRoute.path && path.method === method)) {
        return next();
    }
    const { token } = req.cookies;
    let role = CANDIDATE.value;
    if (!token) {
        return res.sendStatus(common_1.STATUS_CODE.UNAUTHORIZED);
    }
    const data = jsonwebtoken_1.default.verify(token, process.env.SECRET_TOKEN);
    if (data.employee) {
        role = data.employee.role;
    }
    if (role === CANDIDATE.value) {
        res.setHeader("user", data);
    }
    else {
        res.setHeader("user", data.employee);
    }
    res.setHeader("email", data.email);
    res.setHeader("role", role);
    if (role === ADMIN.value) {
        // check role admin: prevent set admin role
        return next();
    }
    if (role === SUPER_ADMIN.value) {
        return next();
    }
    const roleLabel = getRoleLabel(role);
    const hasPermission = getPermission(roleLabel, currentRoute.path, method);
    if (!hasPermission) {
        return res.status(common_1.STATUS_CODE.FORBIDDEN).send("Forbidden");
    }
    next();
};
exports.authMiddleware = authMiddleware;
const getRoleLabel = (role) => {
    var _a;
    return (_a = Object.values(common_1.ROLES).find((item) => item.value === role)) === null || _a === void 0 ? void 0 : _a.label;
};
const getPermission = (role = "", path, method) => {
    var _a;
    return !!((_a = index_1.PERMISSION[role][path]) === null || _a === void 0 ? void 0 : _a.includes(method));
};
