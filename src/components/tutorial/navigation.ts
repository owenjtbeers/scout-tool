import { router as ExpoRouter } from "expo-router";
import { Organization } from "../../redux/user/types";
import {
  HOME_MAP_SCREEN,
  SETTINGS_MANAGE_CROPS_SCREEN,
  SETTINGS_MANAGE_GROWERS_SCREEN,
  SETTINGS_MANAGE_PESTS_SCREEN,
} from "../../navigation/screens";

export const navigateToNextPhaseOfTutorial = (
  router: typeof ExpoRouter,
  userOrg: Organization
) => {
  if (!userOrg.hasSetupGrower) {
    router.push(SETTINGS_MANAGE_GROWERS_SCREEN);
    return;
  }
  if (!userOrg.hasSetupCrops) {
    router.push(SETTINGS_MANAGE_CROPS_SCREEN);
    return;
  }
  // if (!userOrg.hasSetupPests) {
  //   router.push(HOME_MAP_SCREEN);
  //   return;
  // }
  router.push(HOME_MAP_SCREEN);
};
