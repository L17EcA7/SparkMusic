// localSettingHandler.js

export default class LocalSettingHandler {
  static setItem(key, data) {
  try {
    // 对数据进行 JSON 编码后再存储
    localStorage.setItem(`${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('设置localStorage数据时出错', error);
  }
}

static getItem(key) {
  const storedData = localStorage.getItem(`${key}`);

  // 检查存储的数据是否为空
  if (storedData) {
    try {
      // 尝试将获取的数据从 JSON 字符串解析回原始数据类型
      return JSON.parse(storedData);
    } catch (parseError) {
      console.error('解析localStorage数据时出错', parseError);
      return null;
    }
  }

  return null;
}

  //
  // static updateItem(key, updater) {
  //   const existingData = this.getItem(key)
  //   if (existingData) {
  //     const newData = updater(existingData)
  //     this.setItem(key, newData)
  //   } else {
  //     console.warn(`未找到键为 ${key} 的存储项`)
  //   }
  // }
}
