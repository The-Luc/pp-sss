import { isEmpty } from '@/common/utils';
import { Notification } from '@/components/Notification';

const dataHandler = response => {
  const { data, errors } = response.data;

  if (!isEmpty(errors)) {
    const { code, message } = errors[0];

    Notification({ type: 'error', title: `Error ${code}`, text: message });
  }

  return data;
};

export default dataHandler;
