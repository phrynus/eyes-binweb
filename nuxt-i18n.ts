import zh from "@/langs/zh.json";
import en from "@/langs/en.json";

// You can use `defineI18nConfig` to get type inferences for options to pass to vue-i18n.
export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: "zh",
    messages: {
      zh,
      en
    }
  };
});
