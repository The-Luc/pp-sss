import axios from "axios";
import queryString from "query-string";
import configResponse from "./interceptors/response/config";
import configRequest from "./interceptors/request/config";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "content-type": "application/json"
  },
  paramsSeriallizer: params => queryString.stringify(params)
});

const configInterceptor = axiosObject => {
  configRequest(axiosObject.interceptors.request);
  configResponse(axiosObject.interceptors.response);
};

configInterceptor(axiosClient);

export default axiosClient;
