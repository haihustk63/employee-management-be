"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformFileName = void 0;
const transformFileName = (fileName) => {
    return fileName.replace(/[ ]+/g, "-");
};
exports.transformFileName = transformFileName;
