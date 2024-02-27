import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios from "axios";
import type { AxiosRequestConfig, AxiosError } from "axios";
import {
  PrepareHeadersType,
  prepareHeaders as prepareScoutToolHeaders,
} from "../utils/prepareHeaders";

export const axiosBaseQuery =
  (
    {
      baseUrl,
      prepareHeaders,
    }: { baseUrl: string; prepareHeaders: PrepareHeadersType } = {
      baseUrl: "",
      prepareHeaders: prepareScoutToolHeaders,
    }
  ): BaseQueryFn<
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
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
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
