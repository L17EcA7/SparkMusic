<script setup>
import { inputDark, datePickerDark } from 'naive-ui'
// locale & dateLocale
import { zhCN, dateZhCN } from 'naive-ui'

const themeOverrides = {
  "common": {
    "borderRadius": "10px",
    "borderRadiusSmall": "6px",
    "primaryColor": "#ffc64bFF",
    "primaryColorHover": "#F5B24DFF",
    "primaryColorPressed": "rgba(207, 146, 18, 1)",
    "primaryColorSuppl": "#ffb61eFF",
    "infoColor": "#2080f0"
  },
  "Message": {
    "closeBorderRadius": "5px",
    "borderRadius": "15px",
    "lineHeight": "1.3"
  },
  "Card": {
    "colorPopover": "#fff",
    "borderRadius": "20px"
  },
  "Menu": {
    "borderRadius": "8px"
  }
}
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-scrollbar style="max-height: auto">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </keep-alive>
        </router-view>
      </n-scrollbar>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
/* 
enter-active 定义进入过渡的结束状态
leave-active 定义离开过渡的结束状态
 */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.31s;
}

/* 
enter定义进入过渡的开始状态
 */
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

/* 
leave-to离场动画结束后的状态
 */
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>