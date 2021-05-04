import { bindErrorToSlack, compareDiffKeys } from "../../../../../common/utils";
import { USER_MODEL } from "../../../../../model/user";

const usersDto = ({ Id, FirstName, LastName, Email, DOB }) => ({
  id: Id || "--",
  firstName: FirstName || "--",
  lastName: LastName || "--",
  email: Email || "--",
  birthday: DOB || "--"
});

export const mappingListUsers = (data, url, method) => {
  const errors = [];
  const response = data.map(item => {
    const errorKeys = compareDiffKeys(USER_MODEL, item);
    if (errorKeys.length > 0) {
      errors.push(...errorKeys);
    }
    return usersDto(item);
  });
  if (errors.length > 0) {
    bindErrorToSlack(method, url, errors);
  }
  return response;
};

export const mappingUserInformation = (data, url, method) => {
  const response = usersDto(data);
  const errorKeys = compareDiffKeys(USER_MODEL, data);
  if (errorKeys.length > 0) {
    bindErrorToSlack(method, url, errorKeys);
  }
  return response;
};
