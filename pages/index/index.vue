<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
</script>
<template>
  <div>{{ userStore.info }}</div>
</template>
<style lang="scss" scoped></style>
