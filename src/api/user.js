import { ENDPOINT } from "../common/constants/api";
import axiosClient from "./axios";
import {
  mappingListUsers,
  mappingUserInformation
} from "./axios/interceptors/response/mapping";

export const getUsers = async () => {
  const { data, url, method } = await axiosClient.get(`${ENDPOINT.USERS}`);
  const dataMapping = mappingListUsers(data, url, method);
  return dataMapping;
};

export const getUser = async id => {
  const { data, url, method } = await axiosClient.get(
    `${ENDPOINT.USERS}/${id}`
  );
  const dataMapping = mappingUserInformation(data, url, method);
  return dataMapping;
};
