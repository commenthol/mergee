import terser from '@rollup/plugin-terser'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: './dist/index.js',
        format: 'es'
      },
      {
        file: './dist/index.cjs',
        format: 'cjs',
        exports: 'named'
      }
    ],
    plugins: []
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: './dist/index.min.js',
        format: 'es'
      },
      {
        file: './dist/index.min.cjs',
        format: 'cjs',
        exports: 'named',
        footer: 'module.exports = exports.default;'
      }
    ],
    plugins: [terser()]
  },
  {
    input: 'src/merge.js',
    output: [
      {
        file: './dist/merge.js',
        format: 'es'
      },
      {
        file: './dist/merge.cjs',
        format: 'cjs',
        exports: 'named'
      }
    ],
    plugins: []
  },
  {
    input: 'src/merge.js',
    output: [
      {
        file: './dist/merge.min.js',
        format: 'es'
      },
      {
        file: './dist/merge.min.cjs',
        format: 'cjs',
        exports: 'named'
      }
    ],
    plugins: [terser()]
  }
]
