"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("@constants/index");
const controller_1 = require("./controller");
const index_2 = require("@middleware/index");
const router = (0, express_1.Router)();
const { ACCOUNT, CHANGE_PASSWORDS } = index_1.ROUTES;
// get all account
router.get(ACCOUNT, index_2.authMiddleware, controller_1.getAllAccounts);
// create an account
router.post(ACCOUNT, index_2.authMiddleware, controller_1.createNewAccount);
//delete an account
router.delete(ACCOUNT, index_2.authMiddleware, controller_1.deleteAccount);
router.patch(ACCOUNT, index_2.authMiddleware, controller_1.updateAccount);
//
router.patch(CHANGE_PASSWORDS, index_2.authMiddleware, controller_1.changePassword);
exports.default = router;
