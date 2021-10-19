import axios from 'axios';
import queryString from 'query-string';
import configResponse from './interceptors/response/configRespone';
import configRequest from './interceptors/request/configRequest';
import { print } from 'graphql/language/printer';

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

export const graphqlRequest = (query, variables = {}) => {
  return axiosClient.post('', {
    query: print(query),
    variables
  });
};
