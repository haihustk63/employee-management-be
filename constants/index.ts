export const BASE_URLS = {
  CANDIDATE_APPLY: "/candidates/apply",
  CANDIDATE_ACCOUNT: "/candidates/accounts",

  EMPLOYEE_PROFILE: "/employees/profile",
  EMPLOYEE_ACCOUNT: "/employees/accounts",

  POSITION: "/positions",

  DELIVERY: "/deliveries",
};

export const ROUTES = {
  CANDIDATE_APPLY: BASE_URLS.CANDIDATE_APPLY,
  CANDIDATE_ACCOUNT: BASE_URLS.CANDIDATE_ACCOUNT,
  CANDIDATE_ACCOUNT_MODIFY: `${BASE_URLS.CANDIDATE_ACCOUNT}/:username`,

  EMPLOYEE_PROFILE: BASE_URLS.EMPLOYEE_PROFILE,
  EMPLOYEE_PROFILE_GROUP: `${BASE_URLS.EMPLOYEE_PROFILE}/group`,
  EMPLOYEE_PROFILE_MODIFY: `${BASE_URLS.EMPLOYEE_PROFILE}/:employeeId`,
  EMPLOYEE_ACCOUNT: BASE_URLS.EMPLOYEE_ACCOUNT,
  EMPLOYEE_ACCOUNT_MODIFY: `${BASE_URLS.EMPLOYEE_ACCOUNT}/:employeeId`,

  POSITION: BASE_URLS.POSITION,
  POSITION_MODIFY: `${BASE_URLS.POSITION}/:positionId`,
  
  DELIVERY: BASE_URLS.DELIVERY,
  DELIVERY_MODIFY: `${BASE_URLS.DELIVERY}/:deliveryId`,
};

export const PASSWORD_SALT_ROUNDS = 10;