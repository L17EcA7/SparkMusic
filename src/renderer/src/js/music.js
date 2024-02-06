import CryptoJS from 'crypto-js';
import axios from "axios";
const handletoken = (text) => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const formattedDateTime = `${year}${month}${day}${text}`;
    return formattedDateTime;
};
const gettoken = (url, level) => {
    const rawToken = handletoken(url + level + 'musiccn_v1');
    const encryptedToken = CryptoJS.MD5(rawToken).toString();
    return encryptedToken;
};
async function _getMusicInfo(ID) {
    try {
        const Response = await axios.get(`https://api.injahow.cn/meting/?type=song&id=${ID}`);
        // 只有在备用接口状态码为200时才返回备用数据
        if (Response.data.code !== 500) {
            return Response.data;
        } else {
            console.error(`Error fetching playlist info. Status code: ${Response.data.code}`);
        }
    } catch (backupError) {
        console.error('Error fetching playlist info:', backupError);
        throw new Error('Failed to fetch playlist info');
    }
}
async function _getPlaylistInfo(ID) {
    try {
        const Response = await axios.get(`https://api.injahow.cn/meting/?type=playlist&id=${ID}`);
        // 只有在备用接口状态码为200时才返回备用数据
        if (Response.data.code !== 500) {
            return Response.data;
        } else {
            console.error(`Error fetching playlist info. Status code: ${Response.data.code}`);
        }
    } catch (backupError) {
        console.error('Error fetching playlist info:', backupError);
        throw new Error('Failed to fetch playlist info');
    }
}

async function getMusicInfo(ID) {
    return await _getMusicInfo(ID);
}
async function getPlaylistInfo(ID) {
    return await _getPlaylistInfo(ID);
}
function GetMusicLink(ID) {
    return `https://api.toubiec.cn/api/wyapi_v1.php?id=${ID}&type=urlv1&level=jymaster&cont=1`;
}
// 示例用法

async function netease2audio(musicList, batchSize = 300, delayBetweenBatches = 20, maxRetry = 3) {
    const result = [];
    let successCount = 0;
    let failureCount = 0;
    // 分批处理歌曲
    for (let i = 0; i < musicList.length; i += batchSize) {
        const batch = musicList.slice(i, i + batchSize);

        // 使用 Promise.all 来等待当前批次的 Promise 解决
        const batchResult = await Promise.all(
            batch.map(async music => {
                let retryCount = 0;

                // 多次尝试获取歌曲信息
                while (retryCount < maxRetry) {
                    try {
                        const songInfo = {
                            name: music.name,
                            artist: music.artist + " | " + extractIdFromUrl(music.url),
                            url: GetMusicLink(extractIdFromUrl(music.url)),
                            cover: music.pic,
                            lrc: music.lrc
                        };

                        // 在这里添加检查逻辑，如果 songInfo 不符合条件，则置为 null
                        if (!(songInfo && typeof songInfo === 'object' && songInfo.url !== undefined)) {
                            console.error(`歌曲信息获取失败，放弃添加歌曲:`, music);
                            failureCount++;
                            break; // 如果失败，退出重试循环
                        }

                        successCount++;
                        return songInfo; // 如果成功获取歌曲信息，返回
                    } catch (error) {
                        console.error(`获取歌曲信息失败（${retryCount + 1}/${maxRetry}）:`, error);
                        retryCount++;
                    }
                }

                failureCount++;
                //return null; // 如果多次重试后仍然无法获取歌曲信息，返回 null
            })
        );

        // 将当前批次的结果添加到总结果中
        const validBatchResult = batchResult.filter(songInfo => songInfo !== null);
        result.push(...validBatchResult);

        // 在处理下一批之前等待一段时间
        if (i + batchSize < musicList.length) {
            await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
    }

    const finalResult = { result, successCount, failureCount };
    console.log(finalResult); // 添加这行用于调试

    return { result, successCount, failureCount };
}

async function GetAudioList(musicList) {
    const result = await netease2audio(musicList);
    console.log(result);
    return result;
}

function extractIdFromUrl(url) {
    try {
        const urlObject = new URL(url.replace("/#/",'/'));
        const params = new URLSearchParams(urlObject.search);
        const id = params.get('id');

        if (id) {
            return id;
        } else {
            throw new Error('ID parameter not found in the URL.');
        }
    } catch (error) {
        console.error('Error extracting ID from URL:', error.message);
        throw error;
    }
}


export { getMusicInfo, getPlaylistInfo, GetMusicLink, extractIdFromUrl, GetAudioList }