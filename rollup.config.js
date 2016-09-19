import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import eslint from 'rollup-plugin-eslint';
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
