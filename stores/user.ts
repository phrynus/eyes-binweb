import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { StateTree } from "pinia";
import RC4 from "crypto-js/rc4";
import CryptoJS from "crypto-js"; // 需要用于编码处理

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

export class CustomRC4Serializer {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  serialize(value: StateTree): string {
    try {
      const serializedData = JSON.stringify(value);
      return RC4.encrypt(serializedData, CryptoJS.enc.Utf8.parse(this.secretKey)).ciphertext.toString(CryptoJS.enc.Hex);
    } catch (error) {
      return "";
    }
  }
  deserialize(value: string): StateTree {
    try {
      const decryptedBytes = RC4.decrypt(
        { ciphertext: CryptoJS.enc.Hex.parse(value) },
        CryptoJS.enc.Utf8.parse(this.secretKey)
      );
      const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData) as StateTree;
    } catch (error) {
      return {} as StateTree;
    }
  }
}

const serializer = new CustomRC4Serializer("MGSVDTKTBUQRFGCTKVTDRAXW");

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
    persist: {
      serializer: {
        deserialize: serializer.deserialize,
        serialize: serializer.serialize
      }
    }
  }
);
