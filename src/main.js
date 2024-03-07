import { createApp } from 'vue'
import router from './router/index'
import store from './store/index'

import '@/assets/css/global.css'
import '@/assets/less/reset.less'
import '@/assets/fonts/fonts.css'

import App from './App.vue'

createApp(App).use(router).use(store).mount('#app')
