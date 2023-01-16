export const STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

export const WORKING_TIME = {
  MORNING_START: "08:00",
  MORNING_END: "12:00",
  AFTERNOON_START: "13:00",
  AFTERNOON_END: "17:00",
};

export const REQUEST_TYPES = {
  MODIFY_CHECKIN: {
    value: 1,
    label: "Modify checkin",
  },
  MODIFY_CHECKOUT: {
    value: 2,
    label: "Modify checkout",
  },
  UNPAID_LEAVE: {
    value: 3,
    label: "Unpaid leave",
    timeLeaving: 3,
  },
  UNPAID_MORNING_LEAVE: {
    value: 4,
    label: "Unpaid leave",
    timeLeaving: 1,
  },
  UNPAID_AFTERNOON_LEAVE: {
    value: 5,
    label: "Unpaid leave",
    timeLeaving: 2,
  },
  ANNUAL_LEAVE: {
    value: 6,
    label: "Annual leave",
    timeLeaving: 3,
  },
  ANNUAL_MORNING_LEAVE: {
    value: 7,
    label: "Annual leave",
    timeLeaving: 1,
  },
  ANNUAL_AFTERNOON_LEAVE: {
    value: 8,
    label: "Annual leave",
    timeLeaving: 2,
  },
  OVERTIME: {
    value: 9,
    label: "Overtime",
  },
  REMOTE: {
    value: 10,
    label: "Remote",
    timeLeaving: 3,
  },
  REMOTE_MORNING: {
    value: 11,
    label: "Remote morning",
    timeLeaving: 1,
  },
  REMOTE_AFTERNOON: {
    value: 12,
    label: "Remote afternoon",
    timeLeaving: 2,
  },
};

export const REQUEST_STATUS = {
  PENDING: {
    value: 1,
    label: "Pending",
    color: "warning",
  },
  ACCEPTED: {
    value: 2,
    color: "green",
    label: "Accepted",
  },
  REJECTED: {
    value: 3,
    color: "error",
    label: "Rejected",
  },
};

export const ROLES = {
  CANDIDATE: {
    value: 0,
    label: "candidate",
  },
  EMPLOYEE: {
    value: 1,
    label: "employee",
  },
  DIVISION_MANAGER: {
    value: 2,
    label: "divisionManager",
  },
  ADMIN: {
    value: 3,
    label: "admin",
  },
  SUPER_ADMIN: {
    value: 4,
    label: "superAdmin",
  },
};

export const WORKING_STATUS = {
  OFFICIAL: {
    value: 1,
    label: "Official",
  },
  PROBATIONARY: {
    value: 2,
    label: "Probationary",
  },
  TEMPORARY_LAYOFFS: {
    value: 3,
    label: "Temporary Layoffs",
  },
};

export const ASSESSMENT = {
  failed: {
    value: 0,
    label: "Failed",
  },
  notGood: {
    value: 1,
    lebel: "Not Good",
  },
  considering: {
    value: 2,
    lebel: "Considering",
  },
  good: {
    value: 3,
    lebel: "Good",
  },
  passed: {
    value: 4,
    lebel: "Passed",
  },
};

export const TEST_STATUS = {
  created: {
    value: 1,
    label: "Created",
  },
  attempting: {
    value: 2,
    label: "Attempting",
  },
  done: {
    value: 3,
    label: "Done",
  },
};

export const QUESTION_TYPES = {
  oneChoice: {
    value: 1,
    label: "One choice",
  },
  multipleChoice: {
    value: 2,
    label: "Multiple choice",
  },
  essays: {
    value: 3,
    label: "Esaays",
  },
};

export const CHECK_IN_OUT_TYPE = {
  checkin: {
    value: 0,
    label: "Check in",
  },
  checkout: {
    value: 1,
    label: "Check out",
  },
};
