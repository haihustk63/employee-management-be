import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CHECK_IN_OUT_TYPE, ROLES, SORT_ORDER } from "@constants/common";
import { REQUEST_STATUS } from "@constants/common";
import dayjs, { Dayjs } from "dayjs";
import { REQUEST_TYPES } from "@constants/common";

const { ADMIN, SUPER_ADMIN, DIVISION_MANAGER, EMPLOYEE } = ROLES;
const leavingTypes = [
  REQUEST_TYPES.ANNUAL_AFTERNOON_LEAVE.value,
  REQUEST_TYPES.ANNUAL_LEAVE.value,
  REQUEST_TYPES.ANNUAL_MORNING_LEAVE.value,
  REQUEST_TYPES.UNPAID_MORNING_LEAVE.value,
  REQUEST_TYPES.UNPAID_AFTERNOON_LEAVE.value,
  REQUEST_TYPES.UNPAID_LEAVE.value,
];

const checkInOutTypes = [
  REQUEST_TYPES.MODIFY_CHECKIN.value,
  REQUEST_TYPES.MODIFY_CHECKOUT.value,
];

const prisma = new PrismaClient();

const undefinedItem = "X";

const createNewRequest = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { date, type } = data;
    const { id: employeeId } = res.getHeader("user") as any;

    const hasSameTypeRequest = await checkSameTypeRequest({
      employeeId,
      type,
      date,
    });
    if (hasSameTypeRequest) {
      return res.status(400).send({
        message:
          "There is another same request on that day. Please cancel it before create a new one",
      });
    }

    const newRequest = await prisma.request.create({
      data: {
        ...data,
        employeeId,
      },
    });

    return res.status(200).send(newRequest);
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const checkSameTypeRequest = async ({ employeeId, type, date }: any) => {
  let typeSearch = leavingTypes.includes(type) ? { in: leavingTypes } : type;
  const sameTypeRequest = await prisma.request.findMany({
    where: {
      employeeId,
      type: typeSearch,
      date: {
        equals: new Date(dayjs(date).format("YYYY-MM-DD")),
      },
    },
  });

  let checked;

  if (!checkInOutTypes.includes(type)) {
    checked = sameTypeRequest.filter((request) => {
      return (
        request.status !== REQUEST_STATUS.REJECTED.value ||
        (request.status === REQUEST_STATUS.REJECTED.value &&
          request.isCancelled)
      );
    })?.length;
  } else {
    checked = sameTypeRequest.filter(
      (request) => request.status === REQUEST_STATUS.PENDING.value
    )?.length;
  }

  if (checked) {
    return true;
  }
  return false;
};

const getRequests = async (req: Request, res: Response) => {
  try {
    const role = res.getHeader("role");
    const { id: employeeId } = res.getHeader("user") as any;
    const { page = 1, limit = 10 } = req.query;

    const requests = await getRequestsWithParams({
      query: req.query,
      role,
      employeeId,
      withLimit: true,
    });

    const requestsWithoutLimit = await getRequestsWithParams({
      query: req.query,
      role,
      employeeId,
      withLimit: false,
    });

    const response = {
      data: requests,
      total: requestsWithoutLimit?.length,
      page: +page,
      limit: +limit,
    };

    return res.status(200).send(response);
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const getRequestsWithParams = async ({
  query,
  role,
  employeeId,
  withLimit,
}: any) => {
  const {
    keyword,
    type,
    status,
    page = 1,
    limit = 10,
    dateSort,
    lastNameSort,
  } = query;

  const orderBy: { [key: string]: object | string } = {};
  const pageParams: object = withLimit
    ? {
        take: +limit,
        skip: (+page - 1) * +limit,
      }
    : {};
  const whereExtraQuery: { [key: string]: object } = {};

  if (dateSort) {
    orderBy.date = +dateSort === SORT_ORDER.ascend.value ? "asc" : "desc";
  }

  if (lastNameSort && role !== EMPLOYEE.value) {
    orderBy.employee = {
      lastName: +lastNameSort === SORT_ORDER.ascend.value ? "asc" : "desc",
    };
  }

  if (keyword) {
    whereExtraQuery.OR = [
      {
        employee: {
          OR: [
            {
              lastName: {
                contains: keyword,
              },
            },
            {
              middleName: {
                contains: keyword,
              },
            },
            {
              firstName: {
                contains: keyword,
              },
            },
          ],
        },
      },
      {
        reason: {
          contains: keyword,
        },
      },
    ];
  }

  if (type) {
    whereExtraQuery.type = {
      equals: +type,
    };
  }

  if (status) {
    whereExtraQuery.status = {
      equals: +status,
    };
  }

  if (role === EMPLOYEE.value) {
    return await prisma.request.findMany({
      where: {
        employeeId,
        ...whereExtraQuery,
      },
      orderBy: orderBy,
      ...pageParams,
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

    return prisma.request.findMany({
      where: {
        employee: {
          deliveryEmployee: {
            deliveryId: currentEmployee?.deliveryEmployee?.deliveryId,
          },
        },
        ...whereExtraQuery,
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
      orderBy: orderBy,
      ...pageParams,
    });
  } else {
    return prisma.request.findMany({
      where: whereExtraQuery,
      include: {
        employee: {
          select: {
            lastName: true,
            firstName: true,
            middleName: true,
          },
        },
      },
      orderBy: orderBy,
      ...pageParams,
    });
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

    if (isCancelled) {
      const requestEmail = request?.employee.employeeAccount?.email;
      if (requestEmail !== email) {
        return res.sendStatus(403);
      }

      if (!request?.isAdminReviewed) {
        await prisma.request.delete({
          where: {
            id: requestId,
          },
        });
        return res.sendStatus(200);
      }

      if (request?.isAdminReviewed) {
        if (
          request.type === REQUEST_TYPES.MODIFY_CHECKIN.value ||
          request.type === REQUEST_TYPES.MODIFY_CHECKOUT.value
        ) {
          return res
            .status(400)
            .send({ message: "Please create another request" });
        } else if (request.status === REQUEST_STATUS.REJECTED.value) {
          return res.status(400).send({
            message: "Can not cancel because this request is rejected",
          });
        } else if (
          request.status === REQUEST_STATUS.ACCEPTED.value &&
          !request.isCancelled
        ) {
          await prisma.request.update({
            where: {
              id: requestId,
            },
            data: {
              isCancelled: true,
              status: REQUEST_STATUS.PENDING.value,
            },
          });
          return res.sendStatus(200);
        } else {
          return res.sendStatus(400);
        }
      }
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
      if (
        status === REQUEST_STATUS.ACCEPTED.value &&
        request?.isCancelled &&
        !checkInOutTypes.includes(request.type)
      ) {
        await prisma.request.delete({
          where: {
            id: requestId,
          },
        });
        return res.sendStatus(200);
      }
      if (
        (request?.type === REQUEST_TYPES.MODIFY_CHECKIN.value ||
          request?.type === REQUEST_TYPES.MODIFY_CHECKOUT.value) &&
        status === REQUEST_STATUS.ACCEPTED.value
      ) {
        await updateCheckInOut({ request, type: request.type });
      }
      await prisma.request.update({
        where: {
          id: requestId,
        },
        data: {
          status,
          isAdminReviewed: true,
        },
      });
    }
    return res.sendStatus(200);
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const updateCheckInOut = async ({ request, type }: any) => {
  const duration = request.duration;
  const [hour, minute] = duration
    ?.split("-")
    ?.filter((part: any) => part !== undefinedItem)?.[0]
    ?.split(":") as any;
  const newTime = dayjs(request.date).hour(hour).minute(minute).toDate();
  const typeCheckInOut =
    type === REQUEST_TYPES.MODIFY_CHECKIN.value
      ? CHECK_IN_OUT_TYPE.checkin.value
      : CHECK_IN_OUT_TYPE.checkout.value;

  const data = await prisma.checkInOut.findFirst({
    where: {
      employeeId: request.employeeId,
      type: typeCheckInOut,
      time: {
        gte: new Date(dayjs(request.date).format("YYYY-MM-DD")),
        lt: new Date(dayjs(request.date).add(1, "day").format("YYYY-MM-DD")),
      },
    },
  });

  if (data) {
    await prisma.checkInOut.update({
      where: {
        id: data.id,
      },
      data: {
        time: newTime,
      },
    });
  } else {
    await prisma.checkInOut.create({
      data: {
        employeeId: request.employeeId,
        time: newTime,
        type: typeCheckInOut,
      },
    });
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
