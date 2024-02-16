import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MAP_REDUCER_KEY } from '../map/mapSlice';
import { USER_URL_PATH } from '../../constants/api/users';
import { ScoutingAppUser } from './types';
import { prepareHeaders } from '../../utils/prepareHeaders';

export const USER_API_REDUCER_KEY = "userApi";
export const userApi = createApi({
  reducerPath: USER_API_REDUCER_KEY,
  baseQuery: fetchBaseQuery({
    baseUrl: USER_URL_PATH,
    prepareHeaders,
  }),
  endpoints: (builder) => ({
    getCurrentUser: builder.query<ScoutingAppUser, string>({
      query: () => `/me`,
      transformResponse: (response: ScoutingAppUser) => {
        return response;
      },
      transformErrorResponse: (response, meta, arg) => {
        return response.status;
      }
    }),
  }),
});
