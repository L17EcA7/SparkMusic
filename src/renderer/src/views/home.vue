<template>
  <n-card content-style="padding: 10px;">
    <n-tabs size="large" :tabs-padding="0" pane-style="padding: 0px;" type="segment" animated>
      <n-tab-pane name="📃 搜歌单">
        <br>
        <SouSongList />
      </n-tab-pane>
      <n-tab-pane name="🎶 搜单曲">
        <br>
        <SouDanQu />
      </n-tab-pane>
      <n-tab-pane name="🏷 忘记我">
        <br>
        <About />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import SouDanQu from '../components/SouDanQu.vue'
import SouSongList from '../components/SouSongList.vue'
import About from '../components/About.vue'
import { useMessage } from 'naive-ui';
const message = useMessage();
function handelMessage() {
  message.info('Hello, Naive UI!');
}
</script>