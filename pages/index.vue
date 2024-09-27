<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
definePageMeta({
  middleware: [
    function () {
      const userStore = useUserStore();
    },
    "auth",
  ],
});
async function heartbeatData() {
  if (Date.now() - userStore.updateTime > 1 * 60 * 1000) {
    try {
      await uApi.run("heartbeat", {}, userStore.token);
      await uApi
        .run("info", {}, userStore.token)
        .then((res) => (userStore.info = res));
      userStore.updateTime = Date.now();
    } catch (err) {
      console.error(err);
      userStore.token = "";
      userStore.updateTime = 0;
      return navigateTo("/login", { redirectCode: 301 });
    }
  }
}
onMounted(async () => {
  heartbeatData();
  setInterval(heartbeatData, 10000);
});
</script>
<template>
  <NuxtPage />
</template>
<style lang="scss" scoped></style>
