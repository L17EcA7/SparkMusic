<template>
    <n-form ref="formRef" :model="model" :rules="rules">
        <n-form-item path="link" label="网易云音乐链接">
            <n-input v-model:value="model.link" size="large" />
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
    <div id="aplayer">

    </div>
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
import { ref, onBeforeUnmount } from "vue";
import {
    useMessage
} from "naive-ui";
import APlayer from 'APlayer';
import { extractIdFromUrl, getMusicInfo } from '../js/music';
import { DownloadMusic } from '../js/downloader';
const model = ref({
    link: null
});
const formRef = ref(null);
const message = useMessage();
const rules = {
    link: [
        {
            required: true,
            validator(rule, value) {
                if (!value) {
                    return new Error("🔗 请输入网易云音乐链接");
                }

                const isValidLink = (link) => {
                    try {
                        const url = new URL(link);

                        // 第一步：确认是不是链接
                        if (!url || !url.protocol || !url.host) {
                            return false;
                        }

                        // 第二步：确认域名是否为 163cn.tv 或 music.163.com
                        if (!(url.host.endsWith('163cn.tv') || url.host.endsWith('music.163.com'))) {
                            return false;
                        }

                        // 第三步：检查路径是否为 /song
                        if (url.pathname !== '/song') {
                            return false;
                        }

                        // 第四步：检查 ? 后是否有 id，并且 id 是数字
                        const params = new URLSearchParams(url.search);
                        const id = params.get('id');
                        return id && /^\d+$/.test(id);
                    } catch (error) {
                        return false;
                    }
                };

                if (!isValidLink(value)) {
                    return new Error("🎼 请输入有效的网易云音乐歌单链接\n 注意不支持 xxx.xx/#/song 格式");
                }

                return true;
            },
            trigger: ["input", "blur"],
        },
    ],
};
var ap = null
var audio = ref(null)
async function handleValidateButtonClick(e) {
    e.preventDefault();
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            message.loading("正在获取中···")
            const id = extractIdFromUrl(model.value.link);
            const Music = await getMusicInfo(id); // 使用 await 等待异步函数返回结果
            if (Music.status == 400) {
                handleError()
            }
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
                autoplay: true,
                audio: [audio.value]
            });
            message.success("获取成功")
            // console.log({
            //     name: Music.song_info.name,
            //     artist: Music.song_info.artist,
            //     url: Music.url_info.url,
            //     cover: Music.song_info.cover,
            //     lrc: Music.song_info.lyric
            // });
        } else {
            message.error("请输入正确的网易云链接");
        }
    });
}

function downloader() {
    if (ap != null) {
        message.success("已经启动下载，可能会卡住，等待几分钟要是不恢复就重开SparkMusic把···");

        // 延时执行 DownloadMusic 函数
        setTimeout(() => {
            DownloadMusic(audio.value.url, `${audio.value.name} - ${audio.value.artist}`);
        }, 1 * 1000); // 5分钟延时，单位是毫秒

    } else {
        message.error("你触发了一个不应该被触发的问题 😱")
    }
}

const a = onBeforeUnmount(() => {
    if (ap != null) {
        ap.destroy()
    }
})

import { h } from 'vue';
import { NAlert } from 'naive-ui';

const renderMessage = (props) => {
    const { type } = props;
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
                width: '480px',
            },
        },
        {
            default: () => props.content,
        }
    );
};

const { error } = useMessage();

const handleError = () => {
    error('请带上这首歌的链接，发送到反馈邮箱：LiTTTTT87@hotmail.com', {
        render: renderMessage,
        closable: true,
    });
};
</script>