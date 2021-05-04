import axiosClient from "./axios/index";

export const fetchErrorAPI = code => {
  return axiosClient.get(`http://localhost:8000/code/${code}`, {
    useUrl: true
  });
};
