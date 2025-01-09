import React from "react";
import { Redirect } from "expo-router";
import { INFO_LANDING_SCREEN } from "../../navigation/screens";

export default function PlatformRedirect() {
  return <Redirect href={INFO_LANDING_SCREEN} />;
}
