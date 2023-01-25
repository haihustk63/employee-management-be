import uploadCloud from "@config/cloudinary";
import { UPCLOUD_FOLDERS } from "@constants/common";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { RequestHandler } from "express";

const prisma = new PrismaClient();

const createEducationProgram: RequestHandler = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    const { tutorId = "", ...rest } = data || {};

    let dataToSave = { ...rest };
    if (req.files) {
      const uploadTasks = (req.files as Express.Multer.File[])?.map(
        (file: any) => {
          return uploadCloud.useConvert({
            file,
            folder: UPCLOUD_FOLDERS.educationMaterials,
          });
        }
      );
      const uploadedItems = await Promise.all(uploadTasks);
      const materialUrls = uploadedItems.map((item) => item.url);
      dataToSave = { ...dataToSave, materials: materialUrls };
    }

    const newProgram = await prisma.educationProgram.create({
      data: dataToSave,
    });

    if (tutorId) {
      await prisma.employeeEducation.create({
        data: {
          employeeId: Number(tutorId),
          isTutor: true,
          programId: newProgram.id,
        },
      });
    }
    return res.status(200).send(newProgram);
  } catch (err) {
    next(err);
  }
};

const getAllEducationPrograms: RequestHandler = async (req, res, next) => {
  try {
    const programs = await prisma.educationProgram.findMany({
      include: {
        employees: {
          select: {
            isTutor: true,
            rate: true,
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
              },
            },
          },
        },
      },
    });

    const resPrograms = transformPrograms(programs);

    return res.status(200).send({ allPrograms: resPrograms });
  } catch (err) {
    next(err);
  }
};

const getMyEducationPrograms: RequestHandler = async (req, res, next) => {
  try {
    const { id: employeeId } = res.getHeader("user") as any;
    const records = await prisma.employeeEducation.findMany({
      where: {
        employeeId,
      },
      include: {
        program: {
          include: {
            employees: {
              select: {
                isTutor: true,
                rate: true,
                employee: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    middleName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const myPrograms = records.map((record) => record.program);
    const resPrograms = transformPrograms(myPrograms);

    return res.status(200).send({ allPrograms: resPrograms });
  } catch (err) {
    next(err);
  }
};

const transformPrograms = (programs: any[]) => {
  return programs?.map((item: any) => {
    const { employees, time, duration, ...rest } = item;
    const tutor = employees?.find(
      (employee: any) => employee.isTutor
    )?.employee;
    const averageRate = calculateAverageRate(employees);
    const endTime = dayjs(time).add(duration, "minutes");
    return { employees, tutor, time, duration, endTime, averageRate, ...rest };
  });
};

const calculateAverageRate = (employees: any[]) => {
  let totalTurns = 0;
  let totalStars = 0;
  employees.forEach((employee) => {
    const { rate } = employee;
    if (rate !== null) {
      totalStars += employee.rate;
      totalTurns += 1;
    }
  });

  return !totalTurns ? 5 : totalStars / totalTurns;
};

const getEducationProgramById: RequestHandler = async (req, res, next) => {
  try {
    const { programId } = req.params;
    if (!programId) {
      return res.sendStatus(400);
    }

    const program = await prisma.educationProgram.findUnique({
      where: {
        id: Number(programId),
      },
      include: {
        employees: {
          select: {
            isTutor: true,
            rate: true,
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
              },
            },
          },
        },
      },
    });

    const employees = program?.employees;
    const tutor = employees?.find(
      (employee: any) => employee.isTutor
    )?.employee;

    return res.status(200).send({ ...program, tutor });
  } catch (err) {
    next(err);
  }
};

const updateEducationProgram: RequestHandler = async (req, res, next) => {
  try {
    const { programId: id } = req.params;
    const programId = parseInt(id);
    const data = JSON.parse(req.body.data);
    const { tutorId = "", deleteMaterialList = [], ...rest } = data || {};
    let dataToSave = { ...rest };
    let newMaterials = [];

    const program = await prisma.educationProgram.findUnique({
      where: {
        id: programId,
      },
    });

    const currentMaterials = program?.materials as any;
    newMaterials = currentMaterials?.filter(
      (item: string) => !deleteMaterialList.includes(item)
    );

    if (req.files) {
      const uploadTasks = (req.files as Express.Multer.File[])?.map(
        (file: any) => {
          return uploadCloud.useConvert({
            file,
            folder: UPCLOUD_FOLDERS.educationMaterials,
          });
        }
      );
      const uploadedItems = await Promise.all(uploadTasks);
      const materialUrls = uploadedItems.map((item) => item.url);
      dataToSave = {
        ...dataToSave,
        materials: [...newMaterials, ...materialUrls],
      };
    }

    console.log(dataToSave);

    const updatedProgram = await prisma.educationProgram.update({
      where: {
        id: Number(programId),
      },
      data: dataToSave,
    });

    const programTutor = await prisma.employeeEducation.findFirst({
      where: {
        programId: Number(programId),
        isTutor: true,
      },
    });

    if (tutorId !== programTutor?.employeeId) {
      await prisma.employeeEducation.deleteMany({
        where: {
          programId: Number(programId),
          isTutor: true,
        },
      });

      await prisma.employeeEducation.upsert({
        where: {
          employeeId_programId: {
            programId: Number(programId),
            employeeId: tutorId,
          },
        },
        create: {
          programId: Number(programId),
          employeeId: tutorId,
          isTutor: true,
        },
        update: {
          isTutor: true,
        },
      });
    }

    return res.status(200).send(updatedProgram);
  } catch (err) {
    next(err);
  }
};

const deleteEducationProgram: RequestHandler = async (req, res, next) => {
  try {
    const { programId } = req.params;

    await prisma.educationProgram.delete({
      where: {
        id: Number(programId),
      },
    });

    return res.status(200).send("OK");
  } catch (err) {
    next(err);
  }
};

const joinEducationProgram: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;
    const { programId } = data;
    const { id: employeeId } = res.getHeader("user") as any;

    const program = await prisma.educationProgram.findUnique({
      where: {
        id: programId,
      },
    });

    if (dayjs(program?.time).isBefore(Date.now())) {
      return res.sendStatus(400).send({ message: "Time to join is end" });
    }

    const record = await prisma.employeeEducation.create({
      data: {
        employeeId,
        programId,
      },
    });

    return res.status(200).send(record);
  } catch (err) {
    next(err);
  }
};

const unJoinEducationProgram: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;
    const { programId } = data;
    const { id: employeeId } = res.getHeader("user") as any;

    await prisma.employeeEducation.delete({
      where: {
        employeeId_programId: {
          employeeId,
          programId,
        },
      },
    });

    return res.status(200).send("OK");
  } catch (err) {
    next(err);
  }
};

const rateEducationProgram: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;
    const { programId, rate } = data;
    const { id: employeeId } = res.getHeader("user") as any;

    const record = await prisma.employeeEducation.findUnique({
      where: {
        employeeId_programId: {
          employeeId,
          programId,
        },
      },
      include: {
        program: true,
      },
    });

    if (!record || typeof rate !== "number" || (rate * 10) % 5 !== 0) {
      return res.sendStatus(400);
    }

    const endTime = dayjs(record.program.time).add(record.program.duration);
    const canRate = endTime.isBefore(Date.now());

    if (canRate) {
      await prisma.employeeEducation.update({
        where: {
          employeeId_programId: {
            employeeId,
            programId,
          },
        },
        data: {
          rate,
        },
      });

      return res.sendStatus(200);
    }
    return res
      .status(400)
      .send({ message: "This program has not finished yet" });
  } catch (err) {
    next(err);
  }
};

export {
  createEducationProgram,
  getAllEducationPrograms,
  getMyEducationPrograms,
  getEducationProgramById,
  updateEducationProgram,
  deleteEducationProgram,
  joinEducationProgram,
  unJoinEducationProgram,
  rateEducationProgram,
};
