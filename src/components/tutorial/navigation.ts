import { router as ExpoRouter } from "expo-router";
import { Organization } from "../../redux/user/types";
import { MANAGE_CROPS_SCREEN, MANAGE_GROWERS_SCREEN, MANAGE_PESTS_SCREEN } from "../../navigation/screens";

export const navigateToNextPhaseOfTutorial = (router: typeof ExpoRouter, userOrg: Organization) => {
  if (!userOrg.hasSetupGrower) {
    router.push(MANAGE_GROWERS_SCREEN)
    return
  }
  if (!userOrg.hasSetupCrops) {
    router.push(MANAGE_CROPS_SCREEN)
    return
  }
  if (!userOrg.hasSetupPests) {
    router.push(MANAGE_PESTS_SCREEN)
    return
  }
  router.push(MANAGE_GROWERS_SCREEN)
}