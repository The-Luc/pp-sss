import errorHandler from './errorHandler';
import tokenHandler from './tokenHandler';

const configRequest = async request => {
  request.use(tokenHandler, errorHandler);
};

export default configRequest;
