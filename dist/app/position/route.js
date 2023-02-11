"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("constants/index");
const controller_1 = require("./controller");
const index_2 = require("@middleware/index");
const { POSITION, POSITION_MODIFY } = index_1.ROUTES;
const router = (0, express_1.Router)();
router.get(POSITION, controller_1.getAllPositions);
router.post(POSITION, index_2.authMiddleware, controller_1.createNewPosition);
router.patch(POSITION_MODIFY, index_2.authMiddleware, controller_1.updatePosition);
router.delete(POSITION_MODIFY, index_2.authMiddleware, controller_1.deletePosition);
exports.default = router;
