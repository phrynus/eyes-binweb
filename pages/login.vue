<script lang="ts" setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
const userStore = useUserStore();
const fpPromise = FingerprintJS.load();

const { t } = useI18n();

const account = ref();
const password = ref();
const submit = async () => {
  const loadingInstance = ElLoading.service({ fullscreen: true });
  try {
    if (!account.value || !password.value) throw t("login.error.empty");
    const fp = await fpPromise;
    const result = await fp.get();

    const body = {
      account: account.value,
      password: password.value,
      udid: result.visitorId,
    };

    const saveUserInfo = (res: any) => {
      userStore.token = res.token;
      userStore.info = res.info;
      userStore.updateTime = Date.now();
    };

    const islogin = await uApi
      .run("isuser", { account: account.value })
      .then((res: any) => true)
      .catch((error: any) => false);
    const isreg = await uApi
      .run(islogin ? "logon" : "reg", body)
      .then((res: any) => {
        if (!islogin) return true;
        saveUserInfo(res);
        return false;
      });
    if (isreg) {
      await uApi.run("logon", body).then((res: any) => saveUserInfo(res));
    }
    loadingInstance.close();
    navigateTo("/", { redirectCode: 301 });
  } catch (error: any) {
    loadingInstance.close();
    ElNotification.error(error.msg || error || "Error");
  }
};
</script>
<template>
  <div class="box">
    <div class="login-container">
      <div class="left">
        <!-- <button @click="setLocale('en')">e</button> -->
        <!-- <button @click="setLocale('zh')">zh</button> -->
        <div class="title">{{ $t("login.title") }}</div>
        <div class="input-container">
          <label class="account">
            <input
              type="text"
              v-model="account"
              :placeholder="$t('login.account')"
            />
          </label>
          <div style="height: 16px"></div>
          <label class="password"> <input type="text" v-model="password" :placeholder="$t('login.password')" /> </label>
          <div style="height: 28px"></div>
          <button class="submit" @click="submit">
            {{ $t("login.submit") }}
          </button>
        </div>
        <div class="user-tips">{{ $t("login.tips") }}</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-container {
    display: flex;
    position: relative;
    justify-content: center;
    width: 400px;
    height: 460px;
    background: #fff;
    border-radius: 16px;
    box-shadow:
      0 4px 32px 0 rgba(0, 0, 0, 0.08),
      0 1px 4px 0 rgba(0, 0, 0, 0.04);
    .left {
      width: 50%;
      display: flex;
      align-items: center;
      flex-direction: column;
      padding-top: 48px;
      .title {
        font-size: 18px;
        color: #333;
        font-weight: 600;
        line-height: 120%;
        height: 24px;
      }
      .input-container {
        margin-top: 32px;
        padding: 16px 0;
        width: 304px;
        display: flex;
        flex-direction: column;
        label {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          line-height: 22px;
          color: rgba(51, 51, 51, 0.8);
          height: 48px;
          background: rgba(0, 0, 0, 0.03);
          border-radius: 999px;
          padding-left: 16px;
          padding-right: 16px;
          input {
            flex: 1;
            font-size: 16px;
            width: 130px;
            height: 100%;
            caret-color: #ff2442;
            color: #333;
          }
        }
        .submit {
          margin-top: 16px;
          height: 48px;
          background: #ff2442;
          color: #fff;
          opacity: 1;
          border-radius: 999px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }
      }
      .user-tips {
        height: 28px;
        margin-top: auto;
        margin-bottom: 32px;
        font-size: 14px;
        font-weight: 400;
        line-height: 120%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(51, 51, 51, 0.6);
      }
    }
  }
}
</style>
