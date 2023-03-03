import { Request, RequestHandler, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createNewDelivery: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;
    const { name, description, managerId } = data;
    await prisma.$transaction(async (trx: any) => {
      const newDelivery = await trx.delivery.create({
        data: {
          name,
          description,
        },
      });

      if (managerId) {
        const deliveryId = newDelivery.id;
        await trx.deliveryEmployee.create({
          data: {
            deliveryId,
            employeeId: managerId,
            isManager: true,
          },
        });
      }
    });

    return res.sendStatus(201);
  } catch (error: any) {
    next(error);
  }
};

const updateDelivery: RequestHandler = async (req, res, next) => {
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
      const recordWithManagerId = await prisma.deliveryEmployee.findUnique({
        where: {
          employeeId: managerId,
        },
      });

      // If found
      if (recordWithManagerId) {
        // If the current role with that id is not manager
        if (!recordWithManagerId?.isManager) {
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
    next(error);
  }
};

const getAllDeliveries: RequestHandler = async (req, res, next) => {
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
    next(error);
  }
};

const deleteDelivery: RequestHandler = async (req, res, next) => {
  try {
    const { deliveryId } = req.params;

    await prisma.delivery.delete({
      where: {
        id: Number(deliveryId),
      },
    });

    return res.sendStatus(200);
  } catch (error: any) {
    next(error);
  }
};

export { createNewDelivery, getAllDeliveries, updateDelivery, deleteDelivery };
