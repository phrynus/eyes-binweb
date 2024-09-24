import { ref, computed } from "vue";
import { defineStore } from "pinia";

interface UserInfo {
  uid: string;
  phone: string | null;
  email: string | null;
  acctno: string;
  name: string;
  pic: string;
  invID: string | null;
  fen: string;
  vipExpTime: string;
  vipExpDate: string;
  agent: string;
}

export const useUserStore = defineStore(
  "user",
  () => {
    const token = ref<string | null>(null);
    const info = ref<UserInfo | null>(null);
    const updateTime = ref<number>(0);
    //
    const isLogin = computed(() => !!token.value);
    const isVip = computed(
      () => info.value?.vipExpTime && new Date(Number(info.value?.vipExpTime + "000")) > new Date()
    );

    return { token, info, updateTime, isLogin, isVip };
  },
  {
    persist: true
  }
);
