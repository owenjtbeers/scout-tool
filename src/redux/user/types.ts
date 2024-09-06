export type ScoutingAppUser = {
  ID: number;
  Email: string;
  FirstName: string;
  LastName: string;
  AccountType: "org_admin" | "sys_admin" | "employee";
  Organization: { ID: number; Name: string };
  OrganizationId: string;
  createdAt: string;
  updatedAt: string;
  token: string;
};
