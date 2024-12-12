import { HOME_MAP_SCREEN, HOME_SCOUT_REPORT_SCREEN, HOME_SETTINGS_SCREEN, HOME_FEEDBACK_SCREEN, HOME_FIELD_UPLOAD_SCREEN } from "../../navigation/screens";
import { MapTabIcon, FieldTabIcon, SettingsTabIcon, FeedbackTabIcon, FieldUploadTabIcon } from "./bottomBar/BottomButtons";

export type TAB = {
  component: React.FC<{ focused: boolean; color: string }>;
  path: string; // ScreenNames[number];
  name: string;
};

export const TABS: Array<TAB> = [
  {
    component: MapTabIcon,
    path: HOME_MAP_SCREEN,
    name: HOME_MAP_SCREEN.split("/").pop() as string,
  },
  {
    component: FieldTabIcon,
    path: HOME_SCOUT_REPORT_SCREEN,
    name: HOME_SCOUT_REPORT_SCREEN.split("/").pop() as string,
  },
  {
    component: SettingsTabIcon,
    path: HOME_SETTINGS_SCREEN,
    name: HOME_SETTINGS_SCREEN.split("/").pop() as string,
  },
  {
    component: FeedbackTabIcon,
    path: HOME_FEEDBACK_SCREEN,
    name: HOME_FEEDBACK_SCREEN.split("/").pop() as string,
  },
];

export const WEB_TABS: Array<TAB> = [
  ...TABS,
  {
    component: FieldUploadTabIcon,
    name: "Field Upload",
    path: HOME_FIELD_UPLOAD_SCREEN,
  },
];