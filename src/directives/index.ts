/* 自定义指令 */
import type { App, Directive } from 'vue'
import permission from './permission'

type direcitvesData = {
  [key: string]: Directive
}

const directives: direcitvesData = {
  permission
}

export default {
  install(app: App) {
    Object.keys(directives).forEach((item) => {
      app.directive(item, directives[item])
    })
  }
}
