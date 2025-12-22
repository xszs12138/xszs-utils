import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      include: ['src/utils/**/*.ts'],
      outDir: 'dist',
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: './src/utils/index.ts',
      name: '@xszs/utils',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['decimal.js', 'exceljs', 'file-saver'],
      output: {
        globals: {
          'decimal.js': 'Decimal',
          'exceljs': 'ExcelJS',
          'file-saver': 'FileSaver',
        },
      },
    },
  },
})
