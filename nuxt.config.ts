// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  modules: ["@pinia/nuxt", "pinia-plugin-persistedstate", "@nuxtjs/i18n", "@element-plus/nuxt"],
  app: {
    head: {
      title: "QRECORD",
      htmlAttrs: { lang: "zh" },
      meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
    }
  },
  i18n: {
    strategy: "prefix_and_default", // 添加路由前缀的方式
    locales: ["en", "zh"], // 配置语种
    defaultLocale: "zh", // 默认语种
    vueI18n: "./nuxt-i18n.ts" // custom path example
  },
  css: ["@/assets/main.scss"],
  devtools: { enabled: true },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
        }
      }
    }
  }
});
