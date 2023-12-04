import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

//初始化CSS
import 'normalize.css'
//全局CSS
import '@/assets/styles/globals.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
