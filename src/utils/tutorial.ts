import { Organization } from "../redux/user/types";

export const hasOrganizationFinishedTutorial = (organization: Organization) => {
  return organization?.hasSetupGrower && organization?.hasSetupCrops && organization?.hasSetupPests
}