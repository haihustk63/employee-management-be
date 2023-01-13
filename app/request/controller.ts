import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ROLES } from "@constants/common";
import { REQUEST_STATUS } from "@constants/common";
import dayjs from "dayjs";

const { ADMIN, SUPER_ADMIN, DIVISION_MANAGER, EMPLOYEE } = ROLES;
const { ACCEPTED, PENDING, REJECTED } = REQUEST_STATUS;

const prisma = new PrismaClient();

const createNewRequest = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { date } = data;
    const { id: employeeId } = res.getHeader("user") as any;

    const pendingRequest = await prisma.request.findMany({
      where: {
        employeeId,
        status: PENDING.value,
      },
    });

    const dateHasPendingRequest = pendingRequest.some((request) => {
      const requestDate = dayjs(request.date).format("dd/MM/YYYY");
      const newRequestDate = dayjs(date).format("dd/MM/YYYY");
      return requestDate === newRequestDate;
    });

    if (dateHasPendingRequest) {
      return res
        .status(400)
        .send({ message: "You have a pending request today" });
    }

    const newRequest = await prisma.request.create({
      data: {
        ...data,
        employeeId,
      },
    });

    return res.status(200).send({ newRequest });
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const getRequests = async (req: Request, res: Response) => {
  try {
    const role = res.getHeader("role");
    const email = res.getHeader("email");
    const { id: employeeId } = res.getHeader("user") as any;

    let allRequests;

    if (role === EMPLOYEE.value) {
      allRequests = await prisma.request.findMany({
        where: {
          employeeId,
        },
      });
    } else if (role === DIVISION_MANAGER.value) {
      const currentEmployee = await prisma.employee.findUnique({
        where: {
          id: employeeId,
        },
        select: {
          deliveryEmployee: {
            select: {
              deliveryId: true,
            },
          },
        },
      });

      allRequests = await prisma.request.findMany({
        where: {
          employee: {
            deliveryEmployee: {
              deliveryId: currentEmployee?.deliveryEmployee?.deliveryId,
            },
          },
        },
        include: {
          employee: {
            select: {
              lastName: true,
              firstName: true,
              middleName: true,
            },
          },
        },
      });
    } else {
      allRequests = await prisma.request.findMany({
        include: {
          employee: {
            select: {
              lastName: true,
              firstName: true,
              middleName: true,
            },
          },
        },
      });
    }

    return res.status(200).send({ allRequests });
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const updateRequest = async (req: Request, res: Response) => {
  try {
    const { status, isCancelled } = req.body.data || {};
    const { requestId: id } = req.params;
    const role = res.getHeader("role");
    const email = res.getHeader("email");
    const requestId = Number(id);

    if (status === undefined && isCancelled === undefined) {
      return res.sendStatus(400);
    }

    const request = await prisma.request.findUnique({
      where: {
        id: requestId,
      },
      include: {
        employee: {
          select: {
            employeeAccount: {
              select: {
                email: true,
                employee: {
                  select: {
                    deliveryEmployee: {
                      select: {
                        deliveryId: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (isCancelled !== undefined) {
      const requestEmail = request?.employee.employeeAccount?.email;
      if (requestEmail !== email) {
        return res.sendStatus(403);
      }
      await prisma.request.update({
        where: {
          id: requestId,
        },
        data: {
          isCancelled,
          status: PENDING.value,
        },
      });
    }

    if (status !== undefined) {
      if (role === EMPLOYEE.value) {
        return res.sendStatus(403);
      }
      if (role === DIVISION_MANAGER.value) {
        const currentAccount = await prisma.employeeAccount.findUnique({
          where: {
            email: email as string,
          },
          select: {
            employee: {
              select: {
                deliveryEmployee: {
                  select: {
                    deliveryId: true,
                  },
                },
              },
            },
          },
        });

        if (
          request?.employee.employeeAccount?.employee?.deliveryEmployee
            ?.deliveryId !==
          currentAccount?.employee?.deliveryEmployee?.deliveryId
        ) {
          return res.sendStatus(403);
        }
      }
      if (status === ACCEPTED.value && request?.isCancelled) {
        await prisma.request.delete({
          where: {
            id: requestId,
          },
        });
        return res.sendStatus(200);
      }
      await prisma.request.update({
        where: {
          id: requestId,
        },
        data: {
          status,
        },
      });
    }
    return res.sendStatus(200);
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

const deleteRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    await prisma.request.delete({
      where: {
        id: Number(requestId),
      },
    });
    return res.sendStatus(200);
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const getOneRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    const request = await prisma.request.findUnique({
      where: {
        id: Number(requestId),
      },
    });

    return res.status(200).send(request);
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

export {
  createNewRequest,
  updateRequest,
  deleteRequest,
  getOneRequest,
  getRequests,
};
