<template>
    <n-alert title="歌单获取功能为测试功能，可能会获取失败" type="info">
        </n-alert><br>
    <n-form ref="formRef" :model="model" :rules="rules">
        <n-form-item path="link" label="网易云歌单链接">
            <n-input v-model:value="model.link" size="large" />
        </n-form-item>
        <n-row :gutter="[0, 24]">
            <n-col :span="24">
                <div style="display: flex; justify-content: flex-end">
                    <n-button :disabled="model.link === null || loading === true" round type="primary"
                        @click="handleValidateButtonClick">
                        获取
                    </n-button>
                </div>
            </n-col>
        </n-row>
    </n-form>
    <div id="aplayer">

    </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";
import {
    useMessage
} from "naive-ui";
import APlayer from 'APlayer';
import { extractIdFromUrl, GetAudioList, getPlaylistInfo } from '../js/music';
import { DownloadMusic } from '../js/downloader';
const model = ref({
    link: null
});
const formRef = ref(null);
const message = useMessage();
const loading = ref(false)
const rules = {
    link: [
        {
            required: true,
            validator(rule, value) {
                if (!value) {
                    return new Error("🔗 请输入网易云歌单链接");
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

                        // 第三步：检查路径是否为 /playlist
                        if (url.pathname.replace("/#", "") !== '/playlist') {
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
                    return new Error("🎼 请输入有效的网易云音乐歌单链接\n 注意不支持 xxx.xx/#/playlist 格式");
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
            loading.value = true;
            message.loading("已经开始获取歌单，等待耐心几分钟，如果失败了会有提示。");
            const id = extractIdFromUrl(model.value.link);

            try {
                const MusicList = await getPlaylistInfo(id);
                if (ap != null) {
                    ap.pause();
                }

                // 等待 GetAudioList 函数执行完毕
                const { result, successCount, failureCount } = await GetAudioList(MusicList);
                message.info("正在检验歌单···");
                const filteredResult = result.filter(songInfo => songInfo !== undefined);
                console.log(result, successCount, failureCount);
                ap = new APlayer({
                    container: document.getElementById('aplayer'),
                    theme: "#FFC64B",
                    lrcType: 3,
                    autoplay: true,
                    listMaxHeight: window.innerHeight * 0.7,
                    audio: filteredResult
                });
                message.success(`获取成功:${successCount} 首，失败:${failureCount} 首`);
                loading.value = false;
            } catch (error) {
                console.error('获取音频列表失败:', error);
                message.error("获取音频列表失败，请重试");
                loading.value = false;
            }
        } else {
            message.error("请输入正确的网易云歌单");
        }
    });
}

const a = onBeforeUnmount(() => {
    if (ap != null) {
        ap.destroy()
    }
})
</script>