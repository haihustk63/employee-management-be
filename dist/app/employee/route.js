"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../../constants/index");
const controller_1 = require("./controller");
const index_2 = require("../../middleware/index");
const multer_1 = __importDefault(require("../../config/multer"));
const { EMPLOYEE_PROFILE, EMPLOYEE_PROFILE_MODIFY, EMPLOYEE_PROFILE_GROUP } = index_1.ROUTES;
const router = (0, express_1.Router)();
// get all profiles
router.get(EMPLOYEE_PROFILE, index_2.authMiddleware, controller_1.getAllEmployeeProfile);
// get a profile by id
router.get(EMPLOYEE_PROFILE_MODIFY, index_2.authMiddleware, controller_1.getOneEmployeeProfile);
// create a new employee profile
router.post(EMPLOYEE_PROFILE, index_2.authMiddleware, multer_1.default.single("avatar"), controller_1.createNewEmployeeProfile);
// create many profile
router.post(EMPLOYEE_PROFILE_GROUP, index_2.authMiddleware, controller_1.createNewEmployeeProfile);
// update a profile
router.patch(EMPLOYEE_PROFILE_MODIFY, index_2.authMiddleware, multer_1.default.single("avatar"), controller_1.updateEmployeeProfile);
// delete a profile
router.delete(EMPLOYEE_PROFILE_MODIFY, index_2.authMiddleware, controller_1.deleteEmployeeProfile);
exports.default = router;
