"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    console.log(error);
    return res.status(error.code || 500).send({ message: error.message });
};
exports.errorHandler = errorHandler;
