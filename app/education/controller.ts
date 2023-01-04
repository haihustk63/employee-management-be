import { sendEmail } from "@config/mailtrap";
import { PrismaClient, Prisma } from "@prisma/client";
import { NextFunction, Request, RequestHandler, Response } from "express";

const prisma = new PrismaClient();

const createEducationProgram: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;
    const { tutorId = "", ...rest } = data;
    const newProgram = await prisma.educationProgram.create({
      data: rest,
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
            confirm: true,
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

    const resPrograms = programs?.map((item: any) => {
      const { employees, ...rest } = item;
      const tutor = employees?.find(
        (employee: any) => employee.isTutor
      )?.employee;

      return { employees, tutor, ...rest };
    });

    return res.status(200).send({ allPrograms: resPrograms });
  } catch (err) {
    next(err);
  }
};

const getEducationProgramById: RequestHandler = async (req, res, next) => {
  try {
    const { programId } = req.params;
    const program = await prisma.educationProgram.findUnique({
      where: {
        id: Number(programId),
      },
      include: {
        employees: {
          select: {
            isTutor: true,
            confirm: true,
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
    const { programId } = req.params;
    const { data } = req.body;
    const { tutorId, ...rest } = data;

    const updatedProgram = await prisma.educationProgram.update({
      where: {
        id: Number(programId),
      },
      data: rest,
    });

    const employee = await prisma.employeeEducation.findUnique({
      where: {
        employeeId_programId: {
          programId: Number(programId),
          employeeId: tutorId,
        },
      },
    });

    if (!employee?.isTutor) {
      const deleteNotConfirmTutor = prisma.$queryRaw`
      DELETE FROM employee_education
      WHERE program_id=${programId}
      AND is_tutor=true
      AND confirm=false
      `;

      const updateIsTutor = prisma.employeeEducation.updateMany({
        where: {
          programId: Number(programId),
        },
        data: {
          isTutor: false,
        },
      });

      const upsertNewTutor = prisma.employeeEducation.upsert({
        create: {
          programId: Number(programId),
          employeeId: tutorId,
          isTutor: true,
        },
        update: {
          isTutor: true,
        },
        where: {
          employeeId_programId: {
            programId: Number(programId),
            employeeId: tutorId,
          },
        },
      });

      await prisma.$transaction([
        deleteNotConfirmTutor,
        updateIsTutor,
        upsertNewTutor,
      ]);
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

    const employeeId = 16;

    const record = await prisma.employeeEducation.create({
      data: {
        employeeId,
        programId,
        confirm: true,
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

    const employeeId = 16;

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

export {
  createEducationProgram,
  getAllEducationPrograms,
  getEducationProgramById,
  updateEducationProgram,
  deleteEducationProgram,
  joinEducationProgram,
  unJoinEducationProgram,
};
