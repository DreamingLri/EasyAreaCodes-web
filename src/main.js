import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)


import router from './router'

app.use(ElementPlus)
app.use(router)
app.mount('#app')

