import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";

const prisma = new PrismaClient();

const getAllEmployeeProfile = async (req: Request, res: Response) => {
  try {
    const allEmployeeProfile = await prisma.employee.findMany({
      include: {
        deliveryEmployee: {
          select: {
            isManager: true,
            delivery: {
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).send({ allEmployeeProfile });
  } catch (error) {
    return res.status(400).send({ error });
  }
};

const getOneEmployeeProfile = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const employeeProfile = await prisma.employee.findUnique({
      where: {
        id: Number(employeeId),
      },
      include: {
        deliveryEmployee: {
          select: {
            isManager: true,
            delivery: {
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).send({ employeeProfile });
  } catch (error) {
    return res.status(400).send({ error });
  }
};

const createNewEmployeeProfile = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;

    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }
    const profileData = { ...data };
    const deliveryId = profileData.deliveryId;
    const isManager = profileData.isManager;
    delete profileData.deliveryId;
    delete profileData.isManager;

    const newEmployeeProfile = await prisma.employee.create({
      data: profileData,
    });

    if (deliveryId) {
      if (isManager) {
        // Change the current manager of that delivery -> not manager
        await prisma.deliveryEmployee.updateMany({
          where: {
            deliveryId: Number(deliveryId),
            isManager: true,
          },
          data: {
            isManager: false,
          },
        });
      }
      await prisma.deliveryEmployee.create({
        data: {
          employeeId: newEmployeeProfile.id,
          deliveryId,
          isManager,
        },
      });
    }

    return res.status(200).send({ newEmployeeProfile });
  } catch (error) {
    return res.status(400).send({ error });
  }
};

const createManyEmployeeProfile = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;

    const newEmployeeProfile = await prisma.employee.createMany({ data });
    return res.status(200).send({ newEmployeeProfile });
  } catch (error) {
    return res.status(400).send({ error });
  }
};

const updateEmployeeProfile = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { employeeId } = req.params;

    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }
    const profileData = { ...data };
    const deliveryId = profileData.deliveryId;
    const isManager = profileData.isManager;
    delete profileData.deliveryId;
    delete profileData.isManager;

    const updatedEmployeeProfile = await prisma.employee.update({
      where: {
        id: Number(employeeId),
      },
      data: profileData,
    });

    // Check if deliveryId is sent
    if (deliveryId) {
      // If yes, check if the employee existed
      const findRecordWithManagerId = await prisma.deliveryEmployee.findUnique({
        where: {
          employeeId: Number(employeeId),
        },
      });

      // If yes
      if (findRecordWithManagerId) {
        // Case move the employee to another delivery
        if (deliveryId !== findRecordWithManagerId.deliveryId) {
          // And assign role manager
          if (isManager) {
            // So first of all, update all roles of "another delivery" => not manager
            await prisma.deliveryEmployee.updateMany({
              where: {
                deliveryId,
                isManager: true,
              },
              data: {
                isManager: false,
              },
            });

            // Assign role manager for that employee
            await prisma.deliveryEmployee.update({
              where: {
                employeeId: Number(employeeId),
              },
              data: {
                deliveryId,
                isManager: true,
              },
            });
          } else {
            // Move employee to another delivery but his role is not manager
            await prisma.deliveryEmployee.update({
              where: {
                employeeId: Number(employeeId),
              },
              data: {
                deliveryId,
                isManager: false,
              },
            });
          }
        } else {
          // Still be in the same delivery
          // So if user assigns another role => change it
          if (findRecordWithManagerId.isManager !== isManager) {
            await prisma.deliveryEmployee.update({
              where: {
                employeeId: Number(employeeId),
              },
              data: {
                isManager,
              },
            });
          }
        }
      } else {
        // If not find any records with "employeeId" => create new
        await prisma.deliveryEmployee.create({
          data: {
            employeeId: Number(employeeId),
            deliveryId,
            isManager,
          },
        });
      }
    }
    return res.status(200).send({ updatedEmployeeProfile });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error });
  }
};

const deleteEmployeeProfile = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;

    await prisma.employee.delete({
      where: { id: Number(employeeId) },
    });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send({ error });
  }
};

export {
  getAllEmployeeProfile,
  getOneEmployeeProfile,
  createNewEmployeeProfile,
  createManyEmployeeProfile,
  updateEmployeeProfile,
  deleteEmployeeProfile,
};
