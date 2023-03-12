import uploadCloud from "@config/cloudinary";
import { novuHelpers } from "@config/novu";
import { ROLES, SORT_ORDER, UPCLOUD_FOLDERS } from "@constants/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import { getAccountWithEmail } from "@app/login-out/controller";

const roleAdmin = [ROLES.ADMIN.value, ROLES.SUPER_ADMIN.value];

const prisma = new PrismaClient();

const getAllEmployeeProfile: RequestHandler = async (req, res, next) => {
  try {
    let { limit = 10, page = 1 } = req.query as any;

    const employees: any = await getEmployeeWithParams(req.query, true);
    const employeesWithoutLimit: any = await getEmployeeWithParams(
      req.query,
      false
    );

    const result = {
      page: +page,
      limit: +limit,
      data: employees,
      total: employeesWithoutLimit?.length,
    };

    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

const getEmployeeWithParams = (query: any, withLimit: boolean) => {
  let {
    delivery,
    keyword,
    position,
    role,
    workingStatus,
    limit = 10,
    page = 1,
    lastNameSort,
    joinDateSort,
  } = query as any;

  return prisma.$queryRaw`
  SELECT ee.id, first_name as firstName, middle_name as middleName, last_name as lastName,
  phone_number as phoneNumber, date_of_birth as dateOfBirth, join_date as joinDate, role,
  paid_leave_count as paidLeaveCount, working_status as workingStatus, avatar, email, 
  delivery_id as deliveryId, is_manager as isManager, dy.name as deliveryName, 
  position_id as positionId, po.name as positionName
  FROM employee as ee
  LEFT JOIN employee_account AS ea ON ee.id = ea.employee_id
  LEFT JOIN delivery_employee AS de ON ee.id = de.employee_id
  LEFT JOIN delivery AS dy ON de.delivery_id = dy.id
  LEFT JOIN position AS po ON po.id = ee.position_id
  WHERE 1
  ${
    keyword
      ? Prisma.sql`AND first_name LIKE ${`%${keyword}%`} 
      OR last_name LIKE ${`%${keyword}%`} 
      OR middle_name LIKE ${`%${keyword}%`} 
      OR phone_number LIKE ${`%${keyword}%`} 
      OR email LIKE ${`%${keyword}%`}`
      : Prisma.empty
  }
  ${delivery ? Prisma.sql`AND delivery_id = ${+delivery}` : Prisma.empty}
  ${position ? Prisma.sql`AND position_id = ${+position}` : Prisma.empty}
  ${role ? Prisma.sql`AND role = ${+role}` : Prisma.empty}
  ${
    workingStatus
      ? Prisma.sql`AND working_status = ${+workingStatus}`
      : Prisma.empty
  }
  ${
    workingStatus
      ? Prisma.sql`AND working_status = ${+workingStatus}`
      : Prisma.empty
  }
  ${
    lastNameSort
      ? +lastNameSort === SORT_ORDER.ascend.value
        ? Prisma.sql`ORDER BY last_name ASC`
        : Prisma.sql`ORDER BY last_name DESC`
      : Prisma.empty
  }
  ${
    joinDateSort
      ? +joinDateSort === SORT_ORDER.ascend.value
        ? Prisma.sql`ORDER BY join_date ASC`
        : Prisma.sql`ORDER BY join_date DESC`
      : Prisma.empty
  }
  ${withLimit && limit ? Prisma.sql`LIMIT ${limit}` : Prisma.empty}
    ${
      withLimit && page && limit
        ? Prisma.sql`OFFSET ${(+page - 1) * +limit}`
        : Prisma.empty
    }
  `;
};

const getOneEmployeeProfile: RequestHandler = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const employeeProfile = await prisma.employee.findUnique({
      where: {
        id: +employeeId,
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
    next(error);
  }
};

const createNewEmployeeProfile: RequestHandler = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data || "{}");
    const deliveryId = data?.deliveryId;
    const email = data?.email;
    const isManager = data?.role === ROLES.DIVISION_MANAGER.value;

    let profileData = { ...data };
    delete profileData?.deliveryId;
    delete profileData?.email;

    if (req.file) {
      const avatarUrl = await uploadCloud.normal({
        file: req.file,
        folder: UPCLOUD_FOLDERS.avatars,
      });

      profileData = { ...profileData, avatar: avatarUrl.url };
    }

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

    await novuHelpers.createNewSubscriber(newEmployeeProfile);

    return res.status(200).send({ newEmployeeProfile });
  } catch (error) {
    next(error);
  }
};

const createManyEmployeeProfile: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;

    const newEmployeeProfile = await prisma.employee.createMany({ data });
    return res.status(200).send({ newEmployeeProfile });
  } catch (error) {
    next(error);
  }
};

const updateEmployeeProfile: RequestHandler = async (req, res, next) => {
  try {
    const {
      employeeAccount: { email: employeeEmail },
      role,
      id,
    } = res.getHeader("user") as any;

    const { employeeId } = req.params;
    const data = JSON.parse(req.body.data || "{}");
    const deliveryId = data?.deliveryId;
    const email = data?.email;
    const isManager = data?.role === ROLES.DIVISION_MANAGER.value;

    let profileData = { ...data };
    delete profileData?.deliveryId;
    delete profileData?.email;

    if (!roleAdmin.includes(role) && id !== +employeeId)
      return res.sendStatus(403);

    if (req.file) {
      const avatarUrl = await uploadCloud.normal({
        file: req.file,
        folder: UPCLOUD_FOLDERS.avatars,
      });

      if (roleAdmin.includes(role))
        profileData = { ...profileData, avatar: avatarUrl?.url };
      else profileData = { avatar: avatarUrl?.url };
    }

    if (profileData.role) {
      if (
        (roleAdmin.includes(profileData.role) &&
          role !== ROLES.SUPER_ADMIN.value) ||
        (!roleAdmin.includes(profileData.role) && !roleAdmin.includes(role))
      ) {
        return res.sendStatus(403);
      }
    }
    await prisma.$transaction(async (trx: any) => {
      const updatedEmployeeProfile = await trx.employee.update({
        where: {
          id: +employeeId,
        },
        data: profileData,
        include: {
          employeeAccount: {
            select: {
              email: true,
              candidateId: true,
              employeeId: true,
            },
          },
        },
      });

      if (email && updatedEmployeeProfile.employeeAccount?.email !== email) {
        const accountOfEmail = await trx.employeeAccount.findUnique({
          where: {
            email,
          },
        });
        if (accountOfEmail?.employeeId) {
          if (accountOfEmail?.employeeId !== +employeeId) {
            return res.status(400).send({
              message: "This account has been assigned to a employee",
            });
          }
        } else {
          await trx.employeeAccount.update({
            where: {
              email,
            },
            data: {
              employeeId: null,
            },
          });
          await trx.employeeAccount.update({
            where: {
              email,
            },
            data: {
              employeeId: +employeeId,
            },
          });
        }
      }

      // Check if deliveryId is sent
      if (deliveryId) {
        // If yes, check if the employee existed
        const findRecordWithManagerId = await trx.deliveryEmployee.findUnique({
          where: {
            employeeId: +employeeId,
          },
        });

        // If yes
        if (findRecordWithManagerId) {
          // Case move the employee to another delivery
          if (deliveryId !== findRecordWithManagerId.deliveryId) {
            if (isManager) {
              // So first of all, update all roles of "another delivery" => not manager
              await trx.deliveryEmployee.updateMany({
                where: {
                  deliveryId,
                  isManager: true,
                },
                data: {
                  isManager: false,
                },
              });

              // Assign role manager for that employee
              await trx.deliveryEmployee.update({
                where: {
                  employeeId: +employeeId,
                },
                data: {
                  deliveryId,
                  isManager: true,
                },
              });
            } else {
              // Move employee to another delivery but his role is not manager
              await trx.deliveryEmployee.update({
                where: {
                  employeeId: +employeeId,
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
                await trx.deliveryEmployee.updateMany({
                  where: {
                    deliveryId,
                  },
                  data: {
                    isManager: false,
                  },
                });
                await trx.deliveryEmployee.update({
                  where: {
                    employeeId: +employeeId,
                  },
                  data: {
                    isManager: true,
                  },
                });
              } else {
                await trx.deliveryEmployee.update({
                  where: {
                    employeeId: +employeeId,
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
            await trx.deliveryEmployee.updateMany({
              where: {
                deliveryId,
              },
              data: {
                isManager: false,
              },
            });
          }
          await trx.deliveryEmployee.create({
            data: {
              employeeId: +employeeId,
              deliveryId,
              isManager: false,
            },
          });
        }
      }
    });

    const emailToGetInfo = id === +employeeId ? employeeEmail : null;
    const employeeInfo = emailToGetInfo
      ? await getAccountWithEmail(emailToGetInfo)
      : {};
    return res.status(200).send(employeeInfo);
  } catch (error) {
    next(error);
  }
};

const deleteEmployeeProfile: RequestHandler = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    await prisma.employee.delete({
      where: { id: +employeeId },
    });
    return res.sendStatus(200);
  } catch (error) {
    next(error);
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
