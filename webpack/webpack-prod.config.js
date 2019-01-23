module.exports = require('./webpack.config.js')({
  isProduction: true,
  devtool: 'source-map',
  cssFileName: 'app.[chunkhash].css'
});
