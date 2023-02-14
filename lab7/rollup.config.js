import esbuild from 'rollup-plugin-esbuild'

export default [
  {
    input: `web-component.ts`,
    plugins: [esbuild()],
    output: [
      {
        file: `public/bundle.js`,
        format: 'cjs'
      },
    ]
  }
]