<template>
  <n-form ref="formRef" :model="model" :rules="rules">
    <n-form-item path="link" label="网易云音乐链接">
      <n-auto-complete v-model:value="model.link" size="large" :options="options" placeholder="输入歌曲URL"
                       :render-label="renderLabel" />
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button :disabled="model.link === null" round type="primary" @click="handleValidateButtonClick">
            获取
          </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>
  <div id="aplayer_DanQu">

  </div>
  <n-tag v-if="audio != null&&CanSeeTheMusicLINK&&MusicLink">下载地址：
    <NA :href="MusicLink" target="_blank">{{ MusicLink
      }}
    </NA>

  </n-tag>
  <br>
  <n-button type="primary" v-if="audio != null" ghost @click="downloader()">
    <n-icon>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 18a3.5 3.5 0 0 0 0-7h-1A5 4.5 0 0 0 7 9a4.6 4.4 0 0 0-2.1 8.4"></path>
          <path d="M12 13v9"></path>
          <path d="M9 19l3 3l3-3"></path>
        </g>
      </svg>
    </n-icon>
    下载歌曲
  </n-button>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import {
  useMessage
} from 'naive-ui'
import APlayer from 'aplayer'
import { GetMusicLink, extractIdFromUrl, getMusicInfo } from '../js/music'
import { DownloadMusic } from '../js/downloader'
import { getSongHistory, saveSongHistory } from '../js/history'
import axios from 'axios'

const model = ref({
  link: null
})
const formRef = ref(null)
const message = useMessage()
const rules = {
  link: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('🔗 请输入网易云音乐链接')
        }

        const isValidLink = (link) => {
          try {
            const url = new URL(link.replace('/#/', '/'))

            // 第一步：确认是不是链接
            if (!url || !url.protocol || !url.host) {
              return false
            }

            // 第二步：确认域名是否为 163cn.tv 或 music.163.com
            if (!(url.host.endsWith('163cn.tv') || url.host.endsWith('music.163.com'))) {
              return false
            }

            // 第三步：检查路径是否为 /song
            if (url.pathname !== '/song') {
              return false
            }

            // 第四步：检查 ? 后是否有 id，并且 id 是数字
            const params = new URLSearchParams(url.search)
            const id = params.get('id')
            return id && /^\d+$/.test(id)
          } catch (error) {
            return false
          }
        }

        if (!isValidLink(value)) {
          return new Error('🎼 请输入有效的网易云音乐歌单链接')
        }

        return true
      },
      trigger: ['input', 'blur']
    }
  ]
}
var ap = null
var audio = ref(null)
var MusicLink = ref(null)
const CanSeeTheMusicLINK = ref(LocalSettingHandler.getItem('setting').CanSeeTheMusicLINK)

async function handleValidateButtonClick(e) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const mes = message.loading('正在获取中···')
      const id = extractIdFromUrl(model.value.link)
      const Music = await getMusicInfo(id) // 使用 await 等待异步函数返回结果
      if (Music.error) {
        handleError()

      }
      if (ap != null) {
        ap.pause()
      }
      audio.value = {
        name: Music[0].name,
        artist: Music[0].artist,
        url: GetMusicLink(id),
        cover: Music[0].pic,
        lrc: Music[0].lrc
      }
      MusicLink.value = await getRedirectedURL(audio.value.url)
      ap = new APlayer({
        container: document.getElementById('aplayer_DanQu'),
        theme: '#FFC64B',
        lrcType: 3,
        autoplay: true,
        audio: [audio.value]
      })
      mes.destroy()
      message.success('获取成功')
      saveSongHistory(id, Music[0].name)
    } else {
      message.error('请输入正确的网易云链接')
    }
  })
}

function downloader() {
  if (ap != null && audio.value && audio.value.url) {
    message.success('已经启动下载，可能会卡住，等待几分钟要是不恢复就重开 SparkMusic...')

    // 使用 fetch 获取重定向后的最终链接
    fetch(audio.value.url)
      .then(response => {
        // 获取 response 的最终 URL
        const finalUrl = response.url
        return finalUrl
      })
      .then(finalUrl => {
        // 调用 DownloadMusic 函数
        DownloadMusic(finalUrl, `${audio.value.name} - ${audio.value.artist}`)
      })
      .catch(error => {
        console.error('下载失败:', error)
        message.error('下载失败，请重试')
      })

  } else {
    message.error('你触发了一个不应该被触发的问题 😱')
  }
}

const a = onBeforeUnmount(() => {
  if (ap != null) {
    ap.pause()
  }
})

import { h } from 'vue'
import { NAlert } from 'naive-ui'

const renderMessage = (props) => {
  const { type } = props
  return h(
    NAlert,
    {
      key: Date.now(),
      closable: props.closable,
      onClose: props.onClose,
      type: type === 'loading' ? 'default' : type,
      title: '遇到了一些问题！无法获取这首歌！',
      style: {
        boxShadow: 'var(--n-box-shadow)',
        maxWidth: 'calc(100vw - 32px)',
        width: '480px'
      }
    },
    {
      default: () => props.content
    }
  )
}

const { error } = useMessage()

const handleError = () => {
  error('请带上这首歌的链接，发送到反馈邮箱：LiTTTTT87@hotmail.com', {
    render: renderMessage,
    closable: true
  })
}
import { computed } from 'vue'
import { NTag } from 'naive-ui'
import LocalSettingHandler from '../js/LocalSettingHandler'

const renderLabel = (option) => {
  let tagType = option.name ? 'warning' : 'info'
  let tagContent = option.name ? `历史记录 | ${option.name}` : '🧐猜你想搜'

  return [
    h(NTag, { size: 'small', type: tagType }, { default: () => tagContent }),
    ' ',
    option.value
  ]
}

const options = computed(() => {
  const list = getSongHistory()
  const isNumeric = /^\d+$/.test(model.value.link)

  if (model.value.link && isNumeric) {
    return [
      {
        id: null,
        name: null,
        value: `https://music.163.com/song?id=${model.value.link}`,
        label: `https://music.163.com/song?id=${model.value.link}`
      },
      ...list.map((item) => ({
        id: item.id,
        name: item.Name,
        value: `https://music.163.com/song?id=${item.id}`,
        label: `https://music.163.com/song?id=${item.id}`
      }))
    ]
  } else {
    return list.map((item) => ({
      id: item.id,
      name: item.Name,
      value: `https://music.163.com/song?id=${item.id}`,
      label: `https://music.163.com/song?id=${item.id}`
    }))
  }
})

async function getRedirectedURL(inputURL) {
  try {
    const response = await axios.head(inputURL, { maxRedirects: 5 }) // 设置最大重定向次数，避免无限循环
    return response.request.responseURL // 直接返回重定向后的URL
  } catch (error) {
    console.error('Error:', error)
    return null // 返回null表示发生错误
  }
}
</script>
