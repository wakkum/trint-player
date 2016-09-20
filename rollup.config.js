import { rollup } from 'rollup';
let version = require('./package.json').version;

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

// postcss deps
import atImport from 'postcss-import';
import cssnano from 'cssnano';
import cssnext from 'postcss-cssnext';
import nested from 'postcss-nested';
import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';

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
      atImport({
        path: ["src/css", "node_modules"]
      })
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
