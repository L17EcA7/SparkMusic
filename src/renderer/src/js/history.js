const HistoryMaxLength = 30
/**
 * 获取歌单历史记录
 * @returns {Array} 歌单历史记录数组
 */
function getSonglistHistory() {
  const songlistHistoryStr = localStorage.getItem('songlistHistory')
  return songlistHistoryStr ? JSON.parse(songlistHistoryStr) : []
}

/**
 * 保存歌单历史记录
 * @param {number} newId - 新歌单的 ID
 * @param {number} newCount - 新歌单的计数
 */
function saveSonglistHistory(newId, newCount) {
  var songlistHistory = getSonglistHistory()

  // 检测是否已存在相同的 ID
  const existingIndex = songlistHistory.findIndex((item) => item.id === newId)

  if (existingIndex !== -1) {
    // 如果存在相同的 ID，更新计数
    songlistHistory[existingIndex].count = newCount
  } else {
    // 如果不存在相同的 ID，添加新的记录

    // 检查是否超过 100 条历史记录
    if (songlistHistory.length >= HistoryMaxLength) {
      // 移除最旧的记录
      songlistHistory.shift()
    }

    // 添加新的记录到数组末尾
    songlistHistory.push({ id: newId, count: newCount })
  }

  // 将更新后的数组保存到本地存储
  localStorage.setItem('songlistHistory', JSON.stringify(songlistHistory))
}

/**
 * 获取歌曲历史记录
 * @returns {Array} 歌曲历史记录数组
 */
function getSongHistory() {
  const songHistoryStr = localStorage.getItem('songHistory')
  return songHistoryStr ? JSON.parse(songHistoryStr) : []
}

/**
 * 保存歌曲历史记录
 * @param {number} newId - 新歌曲的 ID
 * @param {string} newName - 新歌曲的名称
 */
function saveSongHistory(newId, newName) {
  var songHistory = getSongHistory()

  // 检测是否已存在相同的 ID
  const existingIndex = songHistory.findIndex((item) => item.id === newId)

  if (existingIndex === -1) {
    // 如果不存在相同的 ID，添加新的记录

    // 检查是否超过 100 条历史记录
    if (songHistory.length >= HistoryMaxLength) {
      // 移除最旧的记录
      songHistory.shift()
    }

    // 添加新的记录到数组末尾
    songHistory.push({ id: newId, Name: newName })

    // 将更新后的数组保存到本地存储
    localStorage.setItem('songHistory', JSON.stringify(songHistory))
  }
}

export { getSonglistHistory, saveSonglistHistory, saveSongHistory, getSongHistory }
