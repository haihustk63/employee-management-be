"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_QUESTION_TYPE_OBJECT = exports.TEST_QUESTION_LEVEL_OBJECT = exports.TEST_QUESTION_LEVEL = exports.TEST_QUESTION_TYPE = void 0;
exports.TEST_QUESTION_TYPE = ["ONE_CHOICE", "MULTIPLE_CHOICE", "ESSAYS"];
exports.TEST_QUESTION_LEVEL = ["EASY", "MEDIUM", "HARD"];
exports.TEST_QUESTION_LEVEL_OBJECT = {
    EASY: {
        color: "success",
        label: "Easy",
        value: "EASY",
        key: "EASY",
    },
    MEDIUM: {
        color: "warning",
        label: "Medium",
        value: "MEDIUM",
        key: "MEDIUM",
    },
    HARD: {
        color: "error",
        label: "Hard",
        value: "HARD",
        key: "HARD",
    },
};
exports.TEST_QUESTION_TYPE_OBJECT = {
    ONE_CHOICE: {
        color: "success",
        label: "One choice",
        value: "ONE_CHOICE",
        key: "ONE_CHOICE",
    },
    MULTIPLE_CHOICE: {
        color: "warning",
        label: "Multiple choice",
        value: "MULTIPLE_CHOICE",
        key: "MULTIPLE_CHOICE",
    },
    ESSAYS: {
        color: "error",
        label: "Essays",
        value: "ESSAYS",
        key: "ESSAYS",
    },
};
