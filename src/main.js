import { createApp } from 'vue'
import router from './router/index'
import store from './store/index'

import * as getApi from '@/apis/http'

import '@/assets/css/global.css'
import '@/assets/less/reset.less'
import '@/assets/fonts/fonts.css'

import App from './App.vue'

const app = createApp(App)

app.config.globalProperties['$http'] = getApi
app.config.globalProperties['$msg'] = ElMessage

app.use(router).use(store).mount('#app')
