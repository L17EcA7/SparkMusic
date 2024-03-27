<template>
  <n-form
    ref="formRef"
    :model="model"
    label-placement="top" :on-submit="SaveSetting()">

    <n-form-item :span="12" label="🔗 显示获取音乐的下载地址" path="CanSeeTheMusicLINK">
      <n-switch v-model:value="model.CanSeeTheMusicLINK">
        <template #checked>
          显示
        </template>
        <template #unchecked>
          不显示
        </template>
      </n-switch>
    </n-form-item>
    <n-form-item :span="12" label="🌚 暗黑主题" path="DarkTheme">
      <n-switch v-model:value="model.DarkTheme" size="large" :rail-style="railStyle">
        <template #checked-icon>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
            <g fill="none">
              <path
                d="M12.75 2.75a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5zm6.28 2.22a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 0 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0zM6.59 13a5.5 5.5 0 1 1 10.819 0h3.841a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5h3.84zm.16 3a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H6.75zm4 3a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5zM4.97 4.97a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 1 1-1.06 1.061L4.97 6.031a.75.75 0 0 1 0-1.061z"
                fill="currentColor"></path>
            </g>
          </svg>
        </template>
        <template #unchecked-icon>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48">
            <g fill="none">
              <path
                d="M25.25 5.25a1.25 1.25 0 1 0-2.5 0v1.5a1.25 1.25 0 1 0 2.5 0v-1.5zM24 10a8 8 0 1 0 0 16a8 8 0 0 0 0-16zM4.29 43.55a1.25 1.25 0 0 0 1.76.16l.01-.007l.05-.04c.046-.038.12-.095.22-.17c.2-.15.506-.37.911-.636a27.69 27.69 0 0 1 3.574-1.972A31.402 31.402 0 0 1 24 38c5.56 0 10.069 1.443 13.185 2.885a27.694 27.694 0 0 1 3.573 1.972a18.508 18.508 0 0 1 1.132.806l.05.04l.01.007a1.25 1.25 0 0 0 1.76-.16c.68-.881-.16-1.76-.16-1.76l-.004-.003l-.028-.024l-.04-.031l-.036-.03a21.007 21.007 0 0 0-1.31-.934a30.194 30.194 0 0 0-3.898-2.153A33.903 33.903 0 0 0 24 35.5a33.903 33.903 0 0 0-14.234 3.115c-1.685.78-3 1.561-3.899 2.153a21.03 21.03 0 0 0-1.31.935a7.779 7.779 0 0 0-.075.06l-.022.018l-.007.006c-.429.356-.507 1.352-.163 1.764zM24 28c.69 0 1.25.56 1.25 1.25v1.5a1.25 1.25 0 1 1-2.5 0v-1.5c0-.69.56-1.25 1.25-1.25zM10 17.25c0-.69.56-1.25 1.25-1.25h1.5a1.25 1.25 0 1 1 0 2.5h-1.5c-.69 0-1.25-.56-1.25-1.25zM35.25 16a1.25 1.25 0 1 0 0 2.5h1.5a1.25 1.25 0 1 0 0-2.5h-1.5zm-19.616-4.366a1.25 1.25 0 0 1-1.768 0l-1.5-1.5a1.25 1.25 0 0 1 1.768-1.768l1.5 1.5a1.25 1.25 0 0 1 0 1.768zm-1.768 12.732a1.25 1.25 0 0 1 1.768 1.768l-1.5 1.5a1.25 1.25 0 0 1-1.768-1.768l1.5-1.5zm18.5-12.732a1.25 1.25 0 0 0 1.768 0l1.5-1.5a1.25 1.25 0 0 0-1.768-1.768l-1.5 1.5a1.25 1.25 0 0 0 0 1.768zm1.768 12.732a1.25 1.25 0 0 0-1.768 1.768l1.5 1.5a1.25 1.25 0 0 0 1.768-1.768l-1.5-1.5z"
                fill="currentColor"></path>
            </g>
          </svg>
        </template>
      </n-switch>
    </n-form-item>
    <n-form-item :span="12" label="🧹 清除所有历史歌曲+歌单搜索缓存" path="ClearSongHistoryAndSonglistHistory">
      <n-popconfirm
        @positive-click="clearLocalStorageItems()"
      >
        <template #trigger>
          <n-button>清除所有历史缓存</n-button>
        </template>
        他们将会消失很久，真的很久！
      </n-popconfirm>
    </n-form-item>

  </n-form>

  <pre>{{ JSON.stringify(model, null, 2) }}
</pre>
</template>
<script setup>
import { useMessage } from 'naive-ui'
import LocalSettingHandler from '../js/LocalSettingHandler'
import { ToggleTheme } from '../App.vue'

const model = ref(LocalSettingHandler.getItem('setting') || {
  'CanSeeTheMusicLINK': false
})
const formRef = ref(null)

const message = useMessage()

function clearLocalStorageItems() {
  localStorage.removeItem('songlistHistory')
  localStorage.removeItem('songHistory')
  message.success('历史缓存已被清除', { duration: 1000 })
}

function SaveSetting() {
  LocalSettingHandler.setItem('setting', model.value)
  message.success("设置已保存(某些设置重启后生效)")
}

const railStyle = ({ focused, checked }) => {
  const style = {}
  if (checked) {
    style.background = '#b78c4e'
    if (focused) {
      style.boxShadow = '0 0 0 2px #d0305040'
    }
  } else {
    style.background = '#ffc64bFF'
    if (focused) {
      style.boxShadow = '0 0 0 2px #2080f040'
    }
  }
  ToggleTheme()
  return style
}
</script>
