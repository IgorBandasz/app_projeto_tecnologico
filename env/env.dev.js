const path = require('path');

module.exports = {
  ENV: 'dev',
  
  UI_KITTEN_PACKAGES_PATH: path.resolve(__dirname, '../node_modules/@ui-kitten'),
  EVA_PACKAGES_PATH: path.resolve(__dirname, '../node_modules/@eva-design'),

};
