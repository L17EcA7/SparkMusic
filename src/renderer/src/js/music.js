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
    const url = `https://music.163.com/song?id=${ID}`;
    const level = "jymaster";
    const _token = gettoken(url, level);

    const requestData = {
        "url": url,
        "level": level,
        "type": "song",
        "token": _token
    };
    const Header = {
        "Token": _token,
        "Timestamp": Date.now(),
    };

    try {
        const response = await axios.post('https://api.toubiec.cn/api/music_v1.php', requestData, {
            headers: Header
        });
        return response.data;
    } catch (error) {
        console.error(error.response.data);
        return error.response.data;
    }
}
async function _getPlaylistInfo(ID) {
    const maxRetries = 3; // 最大重试次数
    let currentRetry = 0;

    while (currentRetry < maxRetries) {
        try {
            const response = await axios.get(`https://api.baka.fun/netease?type=playlist&id=${ID}`);

            // 只有在状态码为200时才返回数据
            if (response.data.code !== 500) {
                return response.data;
            } else {
                console.error(`Error fetching playlist info. Status code: ${response.data.code}`);
            }
        } catch (error) {
            console.error('Error fetching playlist info:', error);
        }

        currentRetry++;
        console.log(`Retrying (${currentRetry}/${maxRetries})...`);
    }

    // 如果重试达到最大次数仍然失败，可以尝试备用接口
    try {
        const backupResponse = await axios.get(`https://api.injahow.cn/meting/?type=playlist&id=${ID}`);

        // 只有在备用接口状态码为200时才返回备用数据
        if (backupResponse.data.code !== 500) {
            return backupResponse.data;
        } else {
            console.error(`Error fetching playlist info (backup). Status code: ${backupResponse.data.code}`);
        }
    } catch (backupError) {
        console.error('Error fetching playlist info (backup):', backupError);
    }

    // 如果所有尝试都失败，你可以根据需要处理
    throw new Error('Failed to fetch playlist info');
}

async function getMusicInfo(ID) {
    return await _getMusicInfo(ID);
}
async function getPlaylistInfo(ID) {
    return await _getPlaylistInfo(ID);
}
async function GetMusicLink(ID) {
    const a = await _getMusicInfo(ID);
    return a.url_info.url;
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
                        var URL = await getMusicInfo(music.id);
                        const songInfo = {
                            name: music.title,
                            artist: music.artist,
                            url: URL.url_info.url,
                            cover: music.cover,
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
        const urlObject = new URL(url);
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