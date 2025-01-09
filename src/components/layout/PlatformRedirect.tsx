import React from "react";
import { Redirect } from "expo-router";
import { LOGIN_SCREEN } from "../../navigation/screens";

export default function PlatformRedirect() {
  return <Redirect href={LOGIN_SCREEN} />;
}
