<template>
    <div id="aplayer">

    </div>
    <n-h3 prefix="bar">
        <n-ellipsis expand-trigger="click" line-clamp="2" :tooltip="false">
            <b>🔮 免责声明&软件使用须知<i> (点击展开)</i></b><br>
            本软件仅供研究和测试使用，使用者必须遵守所在国家和地区的法律法规。<br>
            使用本软件产生的任何行为和后果由用户自行承担，软件作者不承担任何法律责任。<br>
            未经许可，禁止对软件进行修改、反向工程或其他形式的篡改。<br>
            <b>免责声明</b><br>
            本软件是基于开源技术或第三方库开发的，软件作者无法对软件的合法性、安全性、完整性提供任何保证。<br>
            软件作者不对软件的误用、滥用或非法使用承担任何责任。<br>
            软件作者不对由于使用本软件而导致的任何直接或间接损失承担责任，包括但不限于数据损失、利润损失等。<br>
            <b>隐私政策</b><br>
            本软件不会主动收集、存储或传播用户的个人信息。<br>
            用户在使用本软件时需谨慎保护个人隐私信息，防止泄露敏感信息。<br>
            <b>最终解释权</b><br>
            软件的最终解释权归软件作者所有，软件作者保留在法律允许的范围内对本声明的解释和修改权利。<br>
        </n-ellipsis>
    </n-h3>

    <n-list hoverable clickable>
        <n-list-item>
            <template #prefix>
                <n-avatar :size="80" src="https://pic.imgdb.cn/item/65ac15bf871b83018adf404f.png" round/>
            </template>
            <n-thing title="SparkMusic 星火音乐" content-style="margin-top: 10px;">
                <template #description>
                    <n-space size="small" style="margin-top: 4px">
                        <n-tag :bordered="false" type="info" size="small">
                            版本 0.0.3 | 测试版
                        </n-tag>
                    </n-space>
                </template>
                这是一个测试版本，一切功能均不完整，<br>
                反馈问题/提供建议请发邮件到：LiTTTTT87@hotmail.com
            </n-thing>
        </n-list-item>
        <n-list-item>
            <template #prefix>
                <n-avatar :size="60" src="https://pic.imgdb.cn/item/65abda5f871b83018ae5ca0a.png" />
            </template>
            <n-thing title="7777777" content-style="margin-top: 10px;">
                <template #description>
                    <n-space size="small" style="margin-top: 4px">
                        <n-tag :bordered="false" type="info" size="small">
                            开发者
                        </n-tag>
                    </n-space>
                </template>
                7777777的狂欢。
            </n-thing>
        </n-list-item>
        <n-list-item>
            <template #prefix>
                <n-avatar :size="60" src="https://q2.qlogo.cn/headimg_dl?dst_uin=3074193836&spec=100" />
            </template>
            <n-thing title="苏晓晴" content-style="margin-top: 10px;">
                <template #description>
                    <n-space size="small" style="margin-top: 4px">
                        <n-tag :bordered="false" type="info" size="small">
                            API 提供者
                        </n-tag>
                    </n-space>
                </template>
                烟雨朦胧，情意难平。
            </n-thing>
        </n-list-item>
        <n-list-item>
            <template #prefix>
                <n-avatar :size="60" src="https://pic.imgdb.cn/item/65abdda8871b83018af7353f.png" />
            </template>
            <n-thing title="小太" content-style="margin-top: 10px;">
                <template #description>
                    <n-space size="small" style="margin-top: 4px">
                        <n-tag :bordered="false" type="info" size="small">
                            API 提供者
                        </n-tag>
                    </n-space>
                </template>
                咱叫佐藤創太 = 創太，可以直接叫咱小太
            </n-thing>
        </n-list-item>
    </n-list>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";
import {
    useMessage
} from "naive-ui";
import APlayer from 'APlayer';
import { extractIdFromUrl, getMusicInfo } from '../js/music';
var ap = null
var audio = ref(null)
const a = onBeforeUnmount(() => {
    if (ap != null) {
        ap.destroy()
    }
})
async function handleValidateButtonClick(e) {
    const id = "1354459686";
    const Music = await getMusicInfo(id); // 使用 await 等待异步函数返回结果
    if (ap != null) {
        ap.pause()
    }
    audio.value = {
        name: Music.song_info.name,
        artist: Music.song_info.artist,
        url: Music.url_info.url,
        cover: Music.song_info.cover,
        lrc: Music.song_info.lyric
    }
    ap = new APlayer({
        container: document.getElementById('aplayer'),
        theme: "#FFC64B",
        lrcType: 1,
        audio: [audio.value]
    });
} handleValidateButtonClick()
</script>