import store from '@/store';
import axios from 'axios';
import queryString from 'query-string';
import configResponse from './interceptors/response/configRespone';
import configRequest from './interceptors/request/configRequest';
import { print } from 'graphql/language/printer';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';

let requestCount = 0;

const axiosClient = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT,
  headers: {
    'content-type': 'application/json',
    Accept: 'application/json'
  },
  paramsSeriallizer: params => queryString.stringify(params)
});

const configInterceptor = axiosObject => {
  configRequest(axiosObject.interceptors.request);
  configResponse(axiosObject.interceptors.response);
};

configInterceptor(axiosClient);

export const graphqlRequest = async (query, variables = {}) => {
  // show loading screen
  store.commit(APP_MUTATES.SET_LOADING_STATE, { value: true });
  requestCount++;

  const res = await axiosClient.post('', {
    query: print(query),
    variables
  });

  // hide loading screen
  requestCount--;
  if (requestCount === 0)
    store.commit(APP_MUTATES.SET_LOADING_STATE, { value: false });

  return res;
};
