import { cloneDeep } from 'lodash';

import { STATUS } from '@/common/constants';

export const DataResult = {
  status: STATUS.NG,
  errorCode: '',
  errorMessages: [],
  data: {}
};

export const getSuccessWithData = data => {
  return {
    ...cloneDeep(DataResult),
    status: STATUS.OK,
    data
  };
};

export const getErrorWithMessages = messages => {
  return {
    ...cloneDeep(DataResult),
    errorMessages: messages
  };
};

export const getErrorWithMessagesAndCode = (messages, code) => {
  return {
    ...getErrorWithMessages(messages),
    errorCode: code
  };
};
