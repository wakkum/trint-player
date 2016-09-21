// Webpack Core
var resolve_here              = require('path').resolve.bind(null, __dirname);

var webpack                   = require('webpack');
var ExtractTextPlugin         = require("extract-text-webpack-plugin");
var StringReplacePlugin       = require('string-replace-webpack-plugin');
var autoprefixer              = require('autoprefixer');

var path_root                 = resolve_here('./');
var path_src                  = resolve_here('./src');

// Do the Magic
var config = {
  entry: {
    trintplayer: [ './src/trint-player.js' ],
  },
  output: {
    chunkFilename : "[id].js",
    filename      : '[name].js',
    path          : resolve_here('dist'),
    publicPath    : '/',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.(jsx|js)$/, loader: StringReplacePlugin.replace({
        replacements: [
          {
            pattern: /@{(\w*?)}/ig,
            replacement: function (match, p1, offset, string) {
              return process.env[p1];
            }
          }
        ]})
      },
      { test: /\.(js)$/, loaders: ['babel?presets[]=es2015'], include: [resolve_here("src")] },
      { test: /\.(sass|scss)$/, loader: ExtractTextPlugin.extract('style-loader', 'css!postcss!sass?outputStyle=compressed&sourceMap&' +
        'includePaths[]=' + path_src
      )},
      { test: /\.(png|jpg|woff|svg)$/, loader: 'url-loader?limit=100000' },
    ],
    noParse: /\.min\.js$/
  },
  postcss: [ autoprefixer({ browsers: ['last 3 versions'] }) ],
  resolve: {
    root: [
      path_root,
      path_src,
    ],
    extensions: ['', '.js', '.jsx', '.scss', '.md']
  },
  plugins: [
    new StringReplacePlugin(),
    new ExtractTextPlugin('trint-player.css'),
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
};

module.exports = config;
