import { merge } from 'lodash';

const files = require.context('.', true, /.js$/);

const modules = {};

files.keys().forEach(key => {
  if (key !== './index.js') {
    merge(modules, files(key).default);
  }
});

export default modules;

export * from './user';
export * from './book';
