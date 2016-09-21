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
  devtool: '#eval-source-map',
  entry: {
    player: [ 'webpack-dev-server/client?http://localhost:3003', 'webpack/hot/only-dev-server', './src/player.js' ],
  },
  output: {
    chunkFilename : "[id].js",
    filename      : '[name].js',
    path          : resolve_here('static'),
    publicPath    : '/',
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
      { test: /\.(sass|scss)$/, loader: 'style!css!postcss!sass?outputStyle=compressed&sourceMap&' +
        'includePaths[]=' + path_src
      },
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
    extensions: ['', '.js', '.jsx', '.scss', '.md', '.css']
  },
  plugins: [
    new StringReplacePlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  devServer: {
    colors      : true,
    contentBase : './static',
    hot         : true,
    inline      : true,
    lazy        : false,
    port        : 3003,
    progress    : true
  }
};

module.exports = config;
