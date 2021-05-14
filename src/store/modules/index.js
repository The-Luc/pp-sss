import _ from 'lodash';
const files = require.context('.', true, /.js$/);
const modules = {};

files.keys().forEach(key => {
  if (key !== './index.js' && _.endsWith(key, '/index.js')) {
    let mod = files(key).default;
    mod.namespaced = true;
    modules[key.replace(/(\.\/|\/index\.js)/g, '')] = mod;
  }
});

export default modules;
