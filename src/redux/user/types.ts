export type ScoutingAppUser = {
  ID: number;
  Email: string;
  FirstName: string;
  LastName: string;
  AccountType: "org_admin" | "sys_admin" | "employee";
  Organization: Organization
  OrganizationId: string;
  createdAt: string;
  updatedAt: string;
  token: string;
};

export type Organization = {
  ID: number; Name: string, hasSetupGrower: boolean, hasSetupCrops: boolean, hasSetupPests: boolean
}