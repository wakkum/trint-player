import { rollup } from 'rollup';
let version = require('./package.json').version;

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

// postcss deps
import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';

let plugins = [
  nodeResolve({
    jsnext: true,
    main: true,
    browser: true,
    skip: [
      'babel-standalone'
    ]
  }),
  postcss({
    plugins: [
      simplevars(),
      nested(),
      cssnext({ warnForDuplicates: false, }),
      cssnano(),
    ],
    extensions: [ '.css' ],
  }),
  commonjs({
    include: 'node_modules/**',
    namedExports: { }
  }),
  babel({
    exclude: 'node_modules/**'
  }),
  eslint({
    exclude: [
      // 'src/styles/**',
    ]
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
