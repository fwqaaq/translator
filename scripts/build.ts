import * as esbuild from 'https://deno.land/x/esbuild@v0.19.0/mod.js'

esbuild
  .build({
    entryPoints: ['./mod.ts'],
    outfile: './node/index.js',
    bundle: true,
    format: 'esm',
    platform: 'browser',
    tsconfig: './tsconfig.json',
  })
  .then(
    () => {
      esbuild.stop()
    },
    () => {
      console.error('Build failed')
    }
  )
