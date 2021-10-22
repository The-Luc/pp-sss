import { Notification } from '@/components/Notification';

const handleBadRequest = () =>
  Notification({ type: 'error', title: '400', text: 'Bad Request' });

const handleNetworkError = () =>
  Notification({
    type: 'error',
    title: 'Internet connection problem',
    text: 'Network Error!!!'
  });

const handleUnauthorized = () =>
  Notification({ type: 'error', title: '401', text: 'Unauthorized!!!' });

const handleForbidden = () =>
  Notification({ type: 'error', title: '403', text: 'Forbidden!!!' });

const handleRequestNotFound = () =>
  Notification({ type: 'error', title: '404', text: 'Request not found!!!' });

const handleMethodNotAllowed = () =>
  Notification({ type: 'error', title: '405', text: 'Method not allow!!!' });

const handleServerError = () =>
  Notification({ type: 'error', title: '500', text: 'Server error!!!' });

const errorHandler = error => {
  const { status } = error.response;
  if (error.message === 'Network Error' && !error.response) {
    handleNetworkError();
  }
  switch (status) {
    case 400: {
      // Translation error from API, base on format data from API to get errorKey
      handleBadRequest();
      break;
    }
    case 401:
      handleUnauthorized();
      break;
    case 403:
      handleForbidden();
      break;
    case 405:
      handleMethodNotAllowed();
      break;
    case 500:
      handleServerError();
      break;
    default:
      handleRequestNotFound(); // 404
      break;
  }

  return Promise.reject(error);
};

export default errorHandler;
