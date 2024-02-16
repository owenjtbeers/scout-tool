import { NavigationProp } from "@react-navigation/native";

// This should mimic what is in the app folder for pathing
// They will correspond to app/{path}.tsx
import {
  HOME_SCREEN,
  HOME_MAP_SCREEN,
  HOME_SCOUT_REPORT_SCREEN,
  MAP_DRAW_SCREEN,
  LOGIN_SCREEN,
} from "./screens";

export type ScreenNames = [
  typeof HOME_SCREEN,
  typeof HOME_MAP_SCREEN,
  typeof HOME_SCOUT_REPORT_SCREEN,
  typeof MAP_DRAW_SCREEN,
  typeof LOGIN_SCREEN
];

export type RootStackParamList = {
  [HOME_SCREEN]: undefined;
  [HOME_MAP_SCREEN]: undefined;
  [HOME_SCOUT_REPORT_SCREEN]: undefined;
  [MAP_DRAW_SCREEN]: undefined;
  [LOGIN_SCREEN]: undefined;
};

export type ScoutToolStackNavigation = NavigationProp<RootStackParamList>;
