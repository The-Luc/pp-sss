import dataHandler from './dataHandler';
import errorHandler from './errorHandler';

const configResponse = async response => {
  response.use(dataHandler, errorHandler);
};

export default configResponse;
