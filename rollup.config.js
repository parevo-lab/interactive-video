import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

// Core library (vanilla JS)
const coreConfig = {
  input: 'src/core/index.ts',
  output: {
    file: 'dist/core/index.js',
    format: 'esm',
    exports: 'named',
    sourcemap: true
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      outDir: 'dist/core',
      declarationDir: 'dist/core'
    })
  ]
};

// React wrapper
const reactConfig = {
  input: 'src/react/index.ts',
  output: {
    file: 'dist/react/index.js',
    format: 'esm',
    exports: 'named',
    sourcemap: true
  },
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      outDir: 'dist/react',
      declarationDir: 'dist/react'
    })
  ],
  external: ['react', 'react-dom']
};

// Vue wrapper
const vueConfig = {
  input: 'src/vue/index.ts',
  output: {
    file: 'dist/vue/index.js',
    format: 'esm',
    exports: 'named',
    sourcemap: true
  },
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      outDir: 'dist/vue',
      declarationDir: 'dist/vue'
    })
  ],
  external: ['vue'],
  onwarn(warning, warn) {
    // Vue related warnings'ları ignore et
    if (warning.code === 'UNRESOLVED_IMPORT' && warning.source === 'vue') return;
    warn(warning);
  }
};

export default [coreConfig, reactConfig, vueConfig];