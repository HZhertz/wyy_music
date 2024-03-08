import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import * as getApi from '@/apis/http'
import util from '@/utils/util'

import '@/assets/css/global.css'
import '@/assets/less/reset.less'
import '@/assets/fonts/fonts.css'

const app = createApp(App)

app.config.globalProperties['$http'] = getApi
app.config.globalProperties['$msg'] = ElMessage
app.config.globalProperties['$utils'] = util

app.use(router).use(store).mount('#app')
