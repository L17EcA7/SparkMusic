<script setup>
import { inputDark, datePickerDark } from 'naive-ui'
// locale & dateLocale
import { zhCN, dateZhCN } from 'naive-ui'

const themeOverrides = {
  'common': {
    'borderRadius': '10px',
    'borderRadiusSmall': '6px',
    'primaryColor': '#ffc64bFF',
    'primaryColorHover': '#F5B24DFF',
    'primaryColorPressed': 'rgba(207, 146, 18, 1)',
    'primaryColorSuppl': '#ffb61eFF',
    'infoColor': '#2080f0'
  },
  'Message': {
    'closeBorderRadius': '5px',
    'borderRadius': '15px',
    'lineHeight': '1.3'
  },
  'Card': {
    'colorPopover': '#fff',
    'borderRadius': '20px'
  },
  'Menu': {
    'borderRadius': '8px'
  }
}


</script>
<script>
import LocalSettingHandler from './js/LocalSettingHandler'
import { darkTheme } from 'naive-ui'

let currentBgColor = ref('')
const theme = ref()

export function ToggleTheme() {
  const setting = LocalSettingHandler.getItem('setting')
  const NowTheme = setting?.DarkTheme
  if (NowTheme) {
    switch (NowTheme) {
      case true:
        theme.value = darkTheme // 假设 darkTheme 是已定义好的深色主题
        currentBgColor.value = 'var(--body-bg-color-dark)'
        break
      case false:
        theme.value = '' // 假设 '' 表示浅色主题
        currentBgColor.value = 'var(--body-bg-color-light)'
        break
      default:
        // 若获取的主题设置无效，则可以设定一个默认值
        theme.value = ''
        currentBgColor.value = 'var(--body-bg-color-light)'
    }
  } else {
    theme.value = '' // 假设 '' 表示浅色主题
    currentBgColor.value = 'var(--body-bg-color-light)'
  }
}ToggleTheme()
</script>
<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides" :theme="theme">
    <n-message-provider>
      <n-scrollbar style="height: 100vh" :style="{ backgroundColor: currentBgColor }">
        <router-view v-slot="{ Component }" >
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
