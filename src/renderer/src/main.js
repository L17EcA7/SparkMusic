import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from "pinia";
import router from './router'
// 通用字体
import 'vfonts/Lato.css'
import './global.css'
// 等宽字体
import 'vfonts/FiraCode.css'
import 'aplayer/dist/APlayer.min.css'
const pinia = createPinia();
createApp(App).use(router).use(pinia).mount('#app');
