import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//ELement按需引入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router","pinia"],
      dts: "types/auto-imports.d.ts",
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      dts: 'types/components.d.ts',
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  //配置全局SCSS变量
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "@import '@/assets/styles/variables.scss';"
      }
    }
  }
})
