import { STATUS } from '@/common/constants';
import { isEmpty } from '@/common/utils';
import { Notification } from '@/components/Notification';

const dataHandler = response => {
  try {
    const { data, error } = response;

    if (!isEmpty(error)) throw error;

    return { data, status: STATUS.OK };
  } catch (error) {
    const { message } = error;

    const errorMsg = message || 'Something went wrong!';

    Notification({
      type: 'error',
      title: 'Error',
      text: errorMsg
    });
    return { status: STATUS.NG };
  }
};

export default dataHandler;
