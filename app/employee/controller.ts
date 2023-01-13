import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import { ROLES } from "@constants/common";

const { EMPLOYEE, DIVISION_MANAGER } = ROLES;

const prisma = new PrismaClient();

const getAllEmployeeProfile = async (req: Request, res: Response) => {
  let { delivery, keyword, position, role, workingStatus, joinDate } =
    req.query;

  const query: any = {
    deliveryEmployee: {
      deliveryId: Number(delivery),
    },
    OR: [
      {
        lastName: {
          contains: keyword as string,
        },
      },
      {
        middleName: {
          contains: keyword as string,
        },
      },
      {
        firstName: {
          contains: keyword as string,
        },
      },
      {
        phoneNumber: {
          contains: keyword as string,
        },
      },
    ],
    positionId: {
      equals: Number(position),
    },
    role: {
      equals: role,
    },
    workingStatus: {
      equals: workingStatus,
    },
  };

  if (!delivery) {
    delete query.deliveryEmployee;
  }
  if (!keyword) {
    delete query.OR;
  }
  if (!position) {
    delete query.positionId;
  }
  if (!role) {
    delete query.role;
  }
  if (!workingStatus) {
    delete query.workingStatus;
  }

  try {
    const allEmployeeProfile = await prisma.employee.findMany({
      where: query,
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
        employeeAccount: {
          select: {
            email: true,
          },
        },
        position: true,
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
                id: true,
              },
            },
          },
        },
        employeeAccount: {
          select: {
            email: true,
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
    const deliveryId = data.deliveryId;
    const email = data.email;
    const isManager = data.role === ROLES.DIVISION_MANAGER.value;
    const profileData = { ...data };
    delete profileData.deliveryId;
    delete profileData.email;

    const newEmployeeProfile = await prisma.employee.create({
      data: profileData,
    });

    if (email) {
      await prisma.employeeAccount.update({
        data: {
          employeeId: newEmployeeProfile.id,
        },
        where: {
          email,
        },
      });
    }

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

    const deliveryId = data.deliveryId;
    const email = data.email;
    const isManager = data.role === ROLES.DIVISION_MANAGER.value;
    const profileData = { ...data };
    delete profileData.deliveryId;
    delete profileData.email;

    const updatedEmployeeProfile = await prisma.employee.update({
      where: {
        id: Number(employeeId),
      },
      data: profileData,
      select: {
        employeeAccount: true,
      },
    });

    if (updatedEmployeeProfile.employeeAccount?.email !== email) {
      const accountOfEmail = await prisma.employeeAccount.findUnique({
        where: {
          email,
        },
      });
      if (accountOfEmail?.employeeId) {
        if (accountOfEmail?.employeeId !== Number(employeeId)) {
          return res
            .status(400)
            .send({ message: "This account has been assigned to a employee" });
        }
      } else {
        await prisma.employeeAccount.update({
          where: {
            email: updatedEmployeeProfile.employeeAccount?.email,
          },
          data: {
            employeeId: null,
          },
        });
        await prisma.employeeAccount.update({
          where: {
            email,
          },
          data: {
            employeeId: Number(employeeId),
          },
        });
      }
    }

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
          if (findRecordWithManagerId.isManager !== isManager) {
            if (isManager) {
              await prisma.deliveryEmployee.updateMany({
                where: {
                  deliveryId,
                },
                data: {
                  isManager: false,
                },
              });
              await prisma.deliveryEmployee.update({
                where: {
                  employeeId: Number(employeeId),
                },
                data: {
                  isManager: true,
                },
              });
            } else {
              await prisma.deliveryEmployee.update({
                where: {
                  employeeId: Number(employeeId),
                },
                data: {
                  isManager: false,
                },
              });
            }
          }
        }
      } else {
        // If not find any records with "employeeId" => create new
        if (isManager) {
          await prisma.deliveryEmployee.updateMany({
            where: {
              deliveryId,
            },
            data: {
              isManager: false,
            },
          });
        }
        await prisma.deliveryEmployee.create({
          data: {
            employeeId: Number(employeeId),
            deliveryId,
            isManager: false,
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
