var path = require('path')
var webpack = require('webpack')
var stats = require('./stats.js')
var getNodeModules = require('./utils/getNodeModules.js')
var nodeModules = getNodeModules()

var buildFolder = path.join('build', 'main')


module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),

  entry: [
    'webpack/hot/signal.js',
    path.resolve(__dirname, '..', 'modules', 'server.js'),
  ],
  target: 'node',
  node: {
    console: true,
    global: false,
    __dirname: true,
    __filename: true,
  },
  recordsPath: path.join(__dirname, '..', buildFolder, 'records.json'),
  output: {
    path: path.resolve(__dirname, '..', buildFolder),
    pathinfo: true,
    filename: 'server.js',
    publicPath: '/assets/',
    libraryTarget: 'commonjs2',
  },
  externals: nodeModules,
  module: {
    noParse: ['react', 'react-dom', 'moment'],
    loaders: [
      {
        test: /\.js$/,
        include: [ path.resolve(__dirname, '..', 'modules') ],
        loaders: ['react-hot', 'monkey-hot', 'babel?cacheDirectory=true'],
      },
      { test: /\.css$/, loader: './myLoader.js?modules&localIdentName=[name]__[local]' },
      // { test: /\.css$/, loader: "./myLoader.js!css?modules" },
      { test: /\.(png)$/, loader: 'url?limit=1' },
      { test: /\.(woff)$/, loader: 'url?limit=1' },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
    new webpack.BannerPlugin('require("source-map-support").install();', { raw: true }),
    new webpack.DefinePlugin({
      CLIENT: false,
      SERVER: true,
      SERVER_API: false,
      DEVELOPMENT: true,
      PRODUCTION: false,
      'process.env.NODE_ENV': JSON.stringify('development'),
      API_SECRET: JSON.stringify(process.env.API_SECRET || 'MY_SUPER_API_SECRET'),
    }),
    new webpack.DefinePlugin({
      STATS: JSON.stringify(stats.load('memoryOnly')),
    }),
  ],
}
