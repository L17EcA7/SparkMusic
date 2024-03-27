import { defineStore } from 'pinia'



export const useSettingStore = defineStore("setting", {
  state: () => {
    return {
      zh_CN: "设置",
      EN_US: "Setting"
    };
  },
});
