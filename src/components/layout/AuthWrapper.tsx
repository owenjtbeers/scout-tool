import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  type PropsWithChildren,
} from "react";

import { ActivityIndicator, View } from "react-native";
// Navigation
import { Redirect, Slot } from "expo-router";
import {
  LOGIN_SCREEN,
} from "../../navigation/screens";
import { colors } from "../../constants/styles";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { useValidateMutation } from "../../redux/auth/authApi";
import { userSlice } from "../../redux/user/userSlice";

// Top level Component that will navigate to the correct screen

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AuthWrapperProps) {
  const { session, isLoading, validate } = useSession();

  useEffect(() => {
    if (session) {
      // TODO: Not sure if this is safe to do. Async functions in useEffect
      // Check if token has expired before validating
      validate();
    }
  }, [session]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!session) {
    console.log("Redirecting to login screen");
    return <Redirect href={LOGIN_SCREEN} />;
  }

  return <Slot />;
}

const AuthContext = createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  validate: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: (token: string) => null,
  signOut: () => null,
  validate: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const session = useSelector((state: RootState) => state.user.token);
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const [validate] = useValidateMutation();
  const dispatch = useDispatch();
  return (
    <AuthContext.Provider
      value={{
        signIn: (token: string) => {
          dispatch(userSlice.actions.setToken(token));
        },
        signOut: () => {
          dispatch(userSlice.actions.logout());
        },
        validate: async () => {
          const response = await validate({});
          if (!("data" in response)) {
            dispatch(userSlice.actions.logout());
          }
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
