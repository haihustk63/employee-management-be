import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const jobs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id: number) => {
    return {
      id,
      title: faker.name.jobTitle(),
      upTo: 4000,
      level: faker.datatype.number({ min: 0, max: 4 }),
      typeOfJob: faker.datatype.number({ min: 0, max: 1 }),
      jobDetail: faker.name.jobDescriptor(),
      positionId: 1,
    };
  });
  return prisma.job.createMany({
    data: jobs,
  });
}

main()
  .then(async () => {
    console.log("DONE");
    prisma.$disconnect();
  })
  .catch(async (error) => {
    console.log("ERROR");
    await prisma.$disconnect();
    process.exit(1);
  });
