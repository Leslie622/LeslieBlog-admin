import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

//初始化CSS
import 'normalize.css'
//全局CSS
import '@/assets/styles/globals.scss'

const app = createApp(App)
// import { useMenuStore } from '@/stores/modules/menu'

app.use(router)
app.use(createPinia())
// const menuStore = useMenuStore()
// await menuStore.getMenuList()

app.mount('#app')
