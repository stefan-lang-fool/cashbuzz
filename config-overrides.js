const path = require('path');
const {addWebpackAlias, addWebpackModuleRule, fixBabelImports, override } = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    ["@"]: path.resolve(__dirname, "src")
  }),
  addWebpackModuleRule({
    test: /\.svg$/,
    loader: 'svg-inline-loader'
  }),
  fixBabelImports('import', {
    style: 'css',
  }),
);