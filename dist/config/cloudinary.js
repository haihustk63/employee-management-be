"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const _1 = require(".");
const fs_1 = __importDefault(require("fs"));
const index_1 = require("../utils/index");
cloudinary_1.v2.config({
    api_key: _1.cloudinaryKey,
    api_secret: _1.cloudinarySecret,
    cloud_name: _1.cloudinaryName,
});
const uploadCloud = {
    normal: ({ file, folder }) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield cloudinary_1.v2.uploader.upload(file.path, {
            folder,
            public_id: (0, index_1.transformFileName)(file.originalname) + Date.now().toString(),
        });
        fs_1.default.unlinkSync(file.path);
        return { url: result.secure_url };
    }),
    useConvert: ({ file, folder }) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield cloudinary_1.v2.uploader.upload(file.path, {
            folder,
            public_id: (0, index_1.transformFileName)(file.originalname) + Date.now().toString(),
            resource_type: "raw",
            raw_convert: "aspose",
        });
        fs_1.default.unlinkSync(file.path);
        return { url: result.secure_url };
    }),
};
exports.default = uploadCloud;
