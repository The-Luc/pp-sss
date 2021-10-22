import { STATUS } from '@/common/constants';
import { isEmpty } from '@/common/utils';
import { Notification } from '@/components/Notification';

const dataHandler = response => {
  try {
    const { data, errors } = response.data;

    if (!isEmpty(errors)) throw errors;

    return { data, status: STATUS.OK };
  } catch (errors) {
    const { code, message } = errors[0];

    const errorMsg = message || 'Something went wrong!';

    Notification({
      type: 'error',
      title: `Error ${code || ''}`,
      text: errorMsg
    });
    return { status: STATUS.NG };
  }
};

export default dataHandler;
