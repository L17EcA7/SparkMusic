// 引入 FileSaver.js 库
import * as FileSaver from 'file-saver'

// 获取文件扩展名的函数
function getFileExtensionFromUrl(url) {
  const matches = url.match(/\.([a-zA-Z0-9]+)$/)
  return matches ? matches[1] : 'unknown'
}
function DownloadMusic(URL, name) {
  const fileExtension = getFileExtensionFromUrl(URL)
  FileSaver.saveAs(URL, `${name}.${fileExtension}`)
}

export { DownloadMusic }
