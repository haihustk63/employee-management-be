export const BASE_URLS = {
  CANDIDATE_APPLY: "/candidates/apply",

  EMPLOYEE_PROFILE: "/employees/profile",
  EMPLOYEE_PROFILE_GROUP: "/group/employees/file",

  ACCOUNT: "/accounts",

  POSITION: "/positions",

  DELIVERY: "/deliveries",

  TEST_QUESTION: "/test-questions",

  TEST_TOPIC: "/test-topics",
  TEST_QUESTION_CLASSIFIED: "/classified/test-questions",

  //login
  LOGIN: "/login",
  LOGOUT: "/logout",

  //constant
  CONSTANT: "/constants",

  // tests
  TEST: "/tests",
  CREATE_TEST: "/create-tests",

  // check in - out
  CHECK_IN_OUT: "/check-in-out",

  // jobs
  JOBS: "/jobs",

  // requests
  REQUESTS: "/requests",

  // education programs
  EDUCATION_PROGRAMS: "/education-programs",
  EDUCATION_PROGRAMS_JOIN: "/education-programs-join",
};

export const ROUTES = {
  CANDIDATE_APPLY: BASE_URLS.CANDIDATE_APPLY,
  CANDIDATE_APPLY_ID: `${BASE_URLS.CANDIDATE_APPLY}/:candidateId`,

  EMPLOYEE_PROFILE: BASE_URLS.EMPLOYEE_PROFILE,
  EMPLOYEE_PROFILE_GROUP: BASE_URLS.EMPLOYEE_PROFILE_GROUP,
  EMPLOYEE_PROFILE_MODIFY: `${BASE_URLS.EMPLOYEE_PROFILE}/:employeeId`,

  ACCOUNT: BASE_URLS.ACCOUNT,
  ACCOUNT_MODIFY: `${BASE_URLS.ACCOUNT}/:email`,

  POSITION: BASE_URLS.POSITION,
  POSITION_MODIFY: `${BASE_URLS.POSITION}/:positionId`,

  DELIVERY: BASE_URLS.DELIVERY,
  DELIVERY_MODIFY: `${BASE_URLS.DELIVERY}/:deliveryId`,

  TEST_QUESTION: BASE_URLS.TEST_QUESTION,
  TEST_QUESTION_CLASSIFIED: BASE_URLS.TEST_QUESTION_CLASSIFIED,
  TEST_QUESTION_MODIFY: `${BASE_URLS.TEST_QUESTION}/:questionId`,

  TEST_TOPICS: BASE_URLS.TEST_TOPIC,
  TEST_TOPICS_MODIFY: `${BASE_URLS.TEST_TOPIC}/:topicId`,

  LOGIN: BASE_URLS.LOGIN,
  LOGOUT: BASE_URLS.LOGOUT,

  // constants
  TEST_QUESTION_CONSTANTS: `${BASE_URLS.CONSTANT}/test-questions`,
  ROLES_CONSTANTS: `${BASE_URLS.CONSTANT}/roles`,

  // tests
  TESTS: BASE_URLS.TEST,
  TEST_MODIFY: `${BASE_URLS.TEST}/:testId`,
  TEST_STATUS: `${BASE_URLS.TEST}/status/:testId`,
  CREATE_TEST_RANDOM: `${BASE_URLS.TEST}/create/random`,
  CREATE_TEST_MANUAL: `${BASE_URLS.TEST}/create/manual`,
  SAVE_TEST: BASE_URLS.TEST,

  // check in out
  CHECK_IN_OUT: BASE_URLS.CHECK_IN_OUT,
  CHECK_IN_OUT_LIST: `${BASE_URLS.CHECK_IN_OUT}/list`,
  CHECK_IN_OUT_TIMESHEET: `${BASE_URLS.CHECK_IN_OUT}/timesheet`,

  // jobs
  JOBS: BASE_URLS.JOBS,
  JOBS_MODIFY: `${BASE_URLS.JOBS}/:jobId`,

  // requests
  REQUESTS: BASE_URLS.REQUESTS,
  REQUESTS_MODIFY: `${BASE_URLS.REQUESTS}/:requestId`,

  // education programs
  EDUCATION_PROGRAMS: BASE_URLS.EDUCATION_PROGRAMS,
  EDUCATION_PROGRAMS_MODIFY: `${BASE_URLS.EDUCATION_PROGRAMS}/:programId`,
  EDUCATION_PROGRAMS_JOIN: BASE_URLS.EDUCATION_PROGRAMS_JOIN,
};

export const PASSWORD_SALT_ROUNDS = 10;

export const GUEST = {
  [ROUTES.CANDIDATE_APPLY]: ["POST"],
};

export const CANDIDATE = {
  [ROUTES.LOGOUT]: ["POST"],
  [ROUTES.TEST_MODIFY]: ["GET", "POST"],
  [ROUTES.TEST_STATUS]: ["GET"],
};

export const EMPLOYEE = {
  [ROUTES.EMPLOYEE_PROFILE_MODIFY]: ["GET"],
  [ROUTES.CHECK_IN_OUT]: ["GET", "POST"],
  [ROUTES.LOGOUT]: ["POST"],
};

export const DIVISION_MANAGER = {
  ...EMPLOYEE,
};

export const PERMISSION: { [key: string]: { [key: string]: string[] } } = {
  CANDIDATE,
  EMPLOYEE,
  DIVISION_MANAGER,
};

export const NOT_NEED_AUTH_PATH = [ROUTES.LOGIN];
