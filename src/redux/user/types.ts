export type ScoutingAppUser = {
  ID: string;
  Email: string;
  role: "org_admin" | "sys_admin" | "employee";
  organization: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  token: string;
};
