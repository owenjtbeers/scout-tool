import React from "react";
import { Redirect } from "expo-router";
import { HOME_MAP_SCREEN, LOGIN_SCREEN } from "../../navigation/screens";

export default function PlatformRedirect() {
  return <Redirect href={HOME_MAP_SCREEN} />;
}
