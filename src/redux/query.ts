import type { BaseQueryFn, fakeBaseQuery } from "@reduxjs/toolkit/query";
import axios from "axios";
import type { AxiosRequestConfig, AxiosError } from "axios";
import {
  prepareHeaders,
  PrepareHeadersType,
  prepareHeaders as prepareScoutToolHeaders,
} from "../utils/network/prepareHeaders";
import { store as scoutingToolStore } from "./store";

export type APIResponse<T> = {
  data: T;
  message: string;
};

export type APIErrorResponse = {
  status: number;
  data: { error: string };
};

export const axiosBaseQuery =
  ({
    baseUrl,
  }: {
    baseUrl: string;
    // prepareHeaders?: PrepareHeadersType;
  }): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }, api) => {
    // @ts-expect-error - the type of headers is not correct
    const newHeaders = prepareScoutToolHeaders(headers, api);
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: newHeaders,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
