import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
//ELement按需引入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ command, mode }) => {
  //环境变量
  const env = loadEnv(mode, process.cwd(), '')
  console.log(command)

  //vite配置
  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/types/auto-imports.d.ts',
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        dts: 'src/types/components.d.ts',
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
    },
    server: {
      proxy: {
        '/proxy': {
          target: env.VITE_APP_API_BASEURL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy/, ''),
        },
      }
    }
  }
})

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     AutoImport({
//       imports: ["vue", "vue-router","pinia"],
//       dts: "src/types/auto-imports.d.ts",
//       resolvers: [ElementPlusResolver()]
//     }),
//     Components({
//       dts: 'src/types/components.d.ts',
//       resolvers: [ElementPlusResolver()]
//     })
//   ],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     }
//   },
//   //配置全局SCSS变量
//   css: {
//     preprocessorOptions: {
//       scss: {
//         additionalData: "@import '@/assets/styles/variables.scss';"
//       }
//     }
//   }
// })
