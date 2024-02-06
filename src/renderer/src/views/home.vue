<template>
  <n-card content-style="padding: 10px;" :bordered="false">
    <n-tabs size="large" :tabs-padding="0" pane-style="padding: 0px;" type="segment"  animated>
      <n-tab-pane name="📃 搜歌单" display-directive="show">
        <br>
        <SouSongList />
      </n-tab-pane>
      <n-tab-pane name="🎶 搜单曲" display-directive="show">
        <br>
        <SouDanQu />
      </n-tab-pane>
      <n-tab-pane name="🏷 忘记我" display-directive="show">
        <br>
        <About />
      </n-tab-pane>
    </n-tabs>
  </n-card>
  <img class="logo" src="https://pic.imgdb.cn/item/65c1c1f49f345e8d03f45c61.png" alt="LOGO">
</template>
<style>
.logo {
  width: 80%;         /* 宽度为父元素的80% */
  height: auto;        /* 高度自动 */
  position: fixed;     /* 固定定位 */
  right: -10%;         /* 右边界超出父元素的10% */
  bottom: -10%;        /* 底部边界超出父元素的10% */
  max-width: 600px;    /* 最大宽度, 可根据需要调整 */
  z-index: -1;
}
</style>
<script setup>
import SouDanQu from '../components/SouDanQu.vue'
import SouSongList from '../components/SouSongList.vue'
import About from '../components/About.vue'
import { useMessage } from 'naive-ui';
const message = useMessage();
</script>