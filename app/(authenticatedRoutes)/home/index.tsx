import React from "react";
import { Redirect } from "expo-router";
import { HOME_MAP_SCREEN } from "../../../src/navigation/screens";

const MyComponent = () => {
  return <Redirect href={HOME_MAP_SCREEN} />;
};

export default MyComponent;
