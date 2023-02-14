"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../../constants/index");
const controller_1 = require("./controller");
const index_2 = require("../../middleware/index");
const router = (0, express_1.Router)();
const { FIREBASE_ACCOUNT, FIREBASE_ACCOUNT_LOGIN } = index_1.ROUTES;
// create an account
router.post(FIREBASE_ACCOUNT_LOGIN, controller_1.loginFirebase);
router.post(FIREBASE_ACCOUNT, index_2.authMiddleware, controller_1.createNewFirebaseAccount);
router.delete(FIREBASE_ACCOUNT, index_2.authMiddleware, controller_1.unlinkFirebaseAccount);
exports.default = router;
