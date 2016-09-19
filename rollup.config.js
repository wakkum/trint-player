import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import sass from 'rollup-plugin-sass';
import uglify from 'rollup-plugin-uglify';
let version = require('./package.json').version;

let plugins = [
  nodeResolve({
    jsnext: true,
    main: true,
    browser: true,
    skip: [
      'babel-standalone'
    ]
  }),
  commonjs({
    include: 'node_modules/**',
    namedExports: { }
  }),
  sass({
    output: 'theme.css',
    options: {
      // includePaths: [],
      indentedSyntax: true,
      indentType: 'space',
      indentWidth: 2,
      outputStyle: 'expanded',
      sourceComments: true
    },
  }),
  babel({
    exclude: 'node_modules/**'
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(uglify());
}

export default {
  format: 'cjs',
  sourceMap: true,
  format: 'umd',
  moduleName: 'trint-player',
  plugins: plugins,
  globals: {
    'babel-standalone': 'Babel'
  }
};
