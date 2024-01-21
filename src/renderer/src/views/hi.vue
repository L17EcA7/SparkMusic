<template>
    <div class="container">
        <img id="logo" src="../assets/A-SparkMusic.svg" alt="星火图">
        <n-gradient-text :size="20" type="warning">
            你好，未知的旅人
        </n-gradient-text>
        <n-button type="primary" @click="start">
            点燃火花
        </n-button>
    </div>
</template>
<script setup>
import localForage from "localforage";
import { useMessage } from 'naive-ui';
import router from '../router';
const message = useMessage()
function start() {
    localForage.setItem("first","true")
    
    message.success("欢迎使用星火图")
    router.push("/")
}

</script>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    /* 设置为纵向排列 */
    justify-content: center;
    /* 垂直居中 */
    align-items: center;
    /* 水平居中 */
    height: 100vh;
}

#logo {
    height: auto;
    width: 35vw;
}
</style>
  