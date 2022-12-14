import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createNewDelivery = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { name, description, managerId } = data;
    const newDelivery = await prisma.delivery.create({
      data: {
        name,
        description,
      },
    });

    if (managerId) {
      const deliveryId = newDelivery.id;
      await prisma.deliveryEmployee.create({
        data: {
          deliveryId,
          employeeId: managerId,
          isManager: true,
        },
      });
    }
    return res.status(200).send({ newDelivery });
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

const updateDelivery = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { deliveryId } = req.params;
    const { name, description, managerId } = data;
    const updatedDelivery = await prisma.delivery.update({
      where: {
        id: Number(deliveryId),
      },
      data: {
        name,
        description,
      },
    });

    if (managerId) {
      // Find the record with term "managerId"
      const findRecordWithManagerId = await prisma.deliveryEmployee.findUnique({
        where: {
          employeeId: managerId,
        },
      });

      // If found
      if (findRecordWithManagerId) {
        // If the current role with that id is not manager
        if (!findRecordWithManagerId?.isManager) {
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
          // Change the current employee's role with that managerId is manager
          await prisma.deliveryEmployee.update({
            where: {
              employeeId: managerId,
            },
            data: {
              isManager: true,
            },
          });
        }
      } else {
        // If not found
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
        // Create new record
        await prisma.deliveryEmployee.create({
          data: {
            employeeId: managerId,
            deliveryId: Number(deliveryId),
            isManager: true,
          },
        });
      }
    }
    return res.status(200).send({ updatedDelivery });
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const getAllDeliveries = async (req: Request, res: Response) => {
  try {
    const allDeliveries = await prisma.delivery.findMany({
      include: {
        deliveryEmployee: {
          where: {
            isManager: true,
          },
          include: {
            employee: {
              select: {
                firstName: true,
                middleName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).send({ allDeliveries });
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

const deleteDelivery = async (req: Request, res: Response) => {
  try {
    const { deliveryId } = req.params;

    await prisma.delivery.delete({
      where: {
        id: Number(deliveryId),
      },
    });

    return res.sendStatus(200);
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
};

export { createNewDelivery, getAllDeliveries, updateDelivery, deleteDelivery };
