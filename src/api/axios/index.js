import axios from 'axios';
import queryString from 'query-string';
import configResponse from './interceptors/response/config';
import configRequest from './interceptors/request/config';
import { print } from 'graphql/language/printer';

const API_ENDPOINT = 'http://development.fluidmedia.com/graphiql';

const axiosClient = axios.create({
  baseURL: API_ENDPOINT,
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

export default (query, variables = {}) => {
  return axiosClient.post('', {
    query: print(query),
    variables
  });
};
