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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const jobs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => {
            return {
                id,
                title: faker_1.faker.name.jobTitle(),
                upTo: 4000,
                level: faker_1.faker.datatype.number({ min: 0, max: 4 }),
                typeOfJob: faker_1.faker.datatype.number({ min: 0, max: 1 }),
                jobDetail: faker_1.faker.name.jobDescriptor(),
                positionId: 1,
            };
        });
        return prisma.job.createMany({
            data: jobs,
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("DONE");
    prisma.$disconnect();
}))
    .catch((error) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("ERROR");
    yield prisma.$disconnect();
    process.exit(1);
}));
