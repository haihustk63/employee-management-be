"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOT_NEED_AUTH_PATH = exports.PERMISSION = exports.PASSWORD_SALT_ROUNDS = exports.ROUTES = exports.BASE_URLS = void 0;
exports.BASE_URLS = {
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
    CONTESTANT_TEST: "/contestant-tests",
    CREATE_TEST: "/create-tests",
    SUBMIT_TEST: "/submit-test",
    // check in - out
    CHECK_IN_OUT: "/check-in-out",
    // jobs
    JOBS: "/jobs",
    // requests
    REQUESTS: "/requests",
    // education programs
    EDUCATION_PROGRAMS: "/education-programs",
    RATE_EDUCATION_PROGRAMS: "/rate-education-programs",
    MY_EDUCATION_PROGRAMS: "/my-education-programs",
    EDUCATION_PROGRAMS_JOIN: "/education-programs-join",
    // statistics
    STATISTICS: "/statistics",
};
exports.ROUTES = {
    CANDIDATE_APPLY: exports.BASE_URLS.CANDIDATE_APPLY,
    CANDIDATE_APPLY_ID: `${exports.BASE_URLS.CANDIDATE_APPLY}/:candidateId`,
    EMPLOYEE_PROFILE: exports.BASE_URLS.EMPLOYEE_PROFILE,
    EMPLOYEE_PROFILE_GROUP: exports.BASE_URLS.EMPLOYEE_PROFILE_GROUP,
    EMPLOYEE_PROFILE_MODIFY: `${exports.BASE_URLS.EMPLOYEE_PROFILE}/:employeeId`,
    ACCOUNT: exports.BASE_URLS.ACCOUNT,
    CHANGE_PASSWORDS: `${exports.BASE_URLS.ACCOUNT}/change-password`,
    POSITION: exports.BASE_URLS.POSITION,
    POSITION_MODIFY: `${exports.BASE_URLS.POSITION}/:positionId`,
    DELIVERY: exports.BASE_URLS.DELIVERY,
    DELIVERY_MODIFY: `${exports.BASE_URLS.DELIVERY}/:deliveryId`,
    TEST_QUESTION: exports.BASE_URLS.TEST_QUESTION,
    TEST_QUESTION_CLASSIFIED: exports.BASE_URLS.TEST_QUESTION_CLASSIFIED,
    TEST_QUESTION_MODIFY: `${exports.BASE_URLS.TEST_QUESTION}/:questionId`,
    TEST_TOPICS: exports.BASE_URLS.TEST_TOPIC,
    TEST_TOPICS_MODIFY: `${exports.BASE_URLS.TEST_TOPIC}/:topicId`,
    LOGIN: exports.BASE_URLS.LOGIN,
    LOGOUT: exports.BASE_URLS.LOGOUT,
    // constants
    TEST_QUESTION_CONSTANTS: `${exports.BASE_URLS.CONSTANT}/test-questions`,
    ROLES_CONSTANTS: `${exports.BASE_URLS.CONSTANT}/roles`,
    // tests
    TESTS: exports.BASE_URLS.TEST,
    TEST_MODIFY: `${exports.BASE_URLS.TEST}/:testId`,
    TEST_STATUS: `${exports.BASE_URLS.TEST}/status/:testId`,
    CREATE_TEST_RANDOM: `${exports.BASE_URLS.TEST}/create/random`,
    CREATE_TEST_MANUAL: `${exports.BASE_URLS.TEST}/create/manual`,
    SAVE_TEST: exports.BASE_URLS.TEST,
    CONTESTANT_TEST: exports.BASE_URLS.CONTESTANT_TEST,
    CONTESTANT_TEST_MODIFY: `${exports.BASE_URLS.CONTESTANT_TEST}/:testId`,
    SUBMIT_TEST: exports.BASE_URLS.SUBMIT_TEST,
    // check in out
    CHECK_IN_OUT: exports.BASE_URLS.CHECK_IN_OUT,
    CHECK_IN_OUT_LIST: `${exports.BASE_URLS.CHECK_IN_OUT}/list`,
    CHECK_IN_OUT_TIMESHEET: `${exports.BASE_URLS.CHECK_IN_OUT}/timesheet`,
    // jobs
    JOBS: exports.BASE_URLS.JOBS,
    JOBS_MODIFY: `${exports.BASE_URLS.JOBS}/:jobId`,
    // requests
    REQUESTS: exports.BASE_URLS.REQUESTS,
    REQUESTS_MODIFY: `${exports.BASE_URLS.REQUESTS}/:requestId`,
    // education programs
    EDUCATION_PROGRAMS: exports.BASE_URLS.EDUCATION_PROGRAMS,
    MY_EDUCATION_PROGRAMS: exports.BASE_URLS.MY_EDUCATION_PROGRAMS,
    RATE_EDUCATION_PROGRAMS: exports.BASE_URLS.RATE_EDUCATION_PROGRAMS,
    EDUCATION_PROGRAMS_MODIFY: `${exports.BASE_URLS.EDUCATION_PROGRAMS}/:programId`,
    EDUCATION_PROGRAMS_JOIN: exports.BASE_URLS.EDUCATION_PROGRAMS_JOIN,
    // statistics
    APPLICATION_STATISTICS: `${exports.BASE_URLS.STATISTICS}/applications`,
    CANDIDATE_STATISTICS: `${exports.BASE_URLS.STATISTICS}/candidates`,
    REQUEST_STATISTICS: `${exports.BASE_URLS.STATISTICS}/requests`,
    JOB_STATISTICS: `${exports.BASE_URLS.STATISTICS}/job`,
    EDUCATION_PROGRAM_STATISTICS: `${exports.BASE_URLS.STATISTICS}/education-programs`,
};
exports.PASSWORD_SALT_ROUNDS = 10;
const routeCandidate = {
    [exports.ROUTES.LOGOUT]: ["POST"],
    [exports.ROUTES.TEST_MODIFY]: ["GET", "POST"],
    [exports.ROUTES.TEST_STATUS]: ["GET"],
    [exports.ROUTES.CONTESTANT_TEST]: ["GET"],
    [exports.ROUTES.CONTESTANT_TEST_MODIFY]: ["GET", "PATCH"],
    [exports.ROUTES.SUBMIT_TEST]: ["POST"],
};
const routeEmployee = {
    [exports.ROUTES.EMPLOYEE_PROFILE_MODIFY]: ["GET"],
    [exports.ROUTES.CHECK_IN_OUT]: ["GET", "POST"],
    [exports.ROUTES.CHECK_IN_OUT_LIST]: ["GET"],
    [exports.ROUTES.CHECK_IN_OUT_TIMESHEET]: ["GET"],
    [exports.ROUTES.REQUESTS]: ["GET", "POST"],
    [exports.ROUTES.REQUESTS_MODIFY]: ["PATCH"],
    [exports.ROUTES.EDUCATION_PROGRAMS]: ["GET"],
    [exports.ROUTES.MY_EDUCATION_PROGRAMS]: ["GET"],
    [exports.ROUTES.RATE_EDUCATION_PROGRAMS]: ["PATCH"],
    [exports.ROUTES.EDUCATION_PROGRAMS_JOIN]: ["POST", "DELETE"],
    [exports.ROUTES.LOGOUT]: ["POST"],
    [exports.ROUTES.CONTESTANT_TEST]: ["GET"],
    [exports.ROUTES.CONTESTANT_TEST_MODIFY]: ["GET", "PATCH"],
    [exports.ROUTES.SUBMIT_TEST]: ["POST"],
};
const routeDivisionManager = Object.assign(Object.assign({}, routeEmployee), { [exports.ROUTES.TESTS]: ["GET", "POST"], [exports.ROUTES.TEST_MODIFY]: ["GET", "PATCH", "DELETE"], [exports.ROUTES.TEST_QUESTION]: ["GET", "POST"], [exports.ROUTES.TEST_QUESTION_MODIFY]: ["GET", "PATCH", "DELETE"], [exports.ROUTES.TEST_TOPICS]: ["GET", "POST"], [exports.ROUTES.TEST_QUESTION_CLASSIFIED]: ["GET"], [exports.ROUTES.TEST_TOPICS_MODIFY]: ["GET", "PATCH", "DELETE"] });
exports.PERMISSION = {
    candidate: routeCandidate,
    employee: routeEmployee,
    divisionManager: routeDivisionManager,
};
// check role admin: prevent set admin role
exports.NOT_NEED_AUTH_PATH = [
    {
        route: exports.ROUTES.LOGIN,
        method: "POST",
    },
    {
        route: exports.ROUTES.CANDIDATE_APPLY,
        method: "POST",
    },
];
