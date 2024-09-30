import { api } from "@/config";

export default defineEventHandler((event) => {
  return {
    hello: api
  };
});
