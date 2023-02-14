"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGetAllRecords = exports.transformFileName = void 0;
const transformFileName = (fileName) => {
    return fileName.replace(/[ ]+/g, "-");
};
exports.transformFileName = transformFileName;
const isGetAllRecords = (fieldAffected, query) => {
    return Object.keys(query).every((key) => !fieldAffected.includes(key));
};
exports.isGetAllRecords = isGetAllRecords;
