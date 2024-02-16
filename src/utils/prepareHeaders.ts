import type { RootState } from "../redux/store";

export const prepareHeaders = (
  headers: Headers,
  { getState }: { getState: () => unknown }
) => {
  // By default, if we have a token in the store, let's use that for authenticated requests
  const token = (getState() as RootState).user.currentUser?.token;
  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }
  return headers;
};
