import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default function createComponents() {
  return Components({
    resolvers: [
      (componentName) => {
        if (componentName === 'Icon') return { name: componentName, from: '@iconify/vue' }
      },
      ElementPlusResolver()
    ],
    dts: 'src/types/components.d.ts'
  })
}
