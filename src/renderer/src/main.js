import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
import 'aplayer/dist/APlayer.min.css'

createApp(App).use(router).mount('#app')
