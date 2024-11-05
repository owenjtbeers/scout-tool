import type { RootState } from "../../redux/store";
import { AxiosHeaders } from "axios";

export type PrepareHeadersType = (
  headers: Headers | undefined,
  { getState }: { getState: () => unknown }
) => Headers;

export const prepareHeaders = (
  headers: AxiosHeaders | undefined,
  { getState }: { getState: () => unknown }
): AxiosHeaders => {
  const newHeaders = new AxiosHeaders(headers);
  // By default, if we have a token in the store, let's use that for authenticated requests
  const token = (getState() as RootState).user?.token;
  if (token) {
    newHeaders.setAuthorization(`Bearer ${token}`);
  }

  return newHeaders;
};
