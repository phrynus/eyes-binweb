import MD5 from "crypto-js/md5";

type Uoptions = {
  baseUrl: string;
  appKey: string;
  appId: number;
  appIndex: string;
  appVer: string;
};

class api {
  options: Uoptions;
  constructor(options: Uoptions) {
    this.options = options;
  }
  async run(op: string, data: any = {}, token: string | null = "") {
    const noToken = ["isuser", "ini", "logon", "reg", "pay", "goods", "getCode"];
    if (!noToken.includes(op) && !token) throw "缺少token";
    const baseUrl = `${this.options.baseUrl}/api/user/${this.options.appId}/${this.options.appIndex}/${this.options.appVer}/${op}`;
    let form = new URLSearchParams();
    Object.entries(data).forEach(([key, value]: [string, any]) => form.append(key, value));
    if (token) form.append("token", token);
    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        body: form
      });
      if (!res.ok) throw res;
      const resTExt = await res.text();
      if (!resTExt) throw resTExt;
      const resData = JSON.parse(resTExt);

      const resSign = MD5(`${resData.code}${resData.time}${this.options.appKey}`).toString();
      if (resSign !== resData.sign) throw "签名错误";
      if (resData.code !== 200) throw resData;
      if (!resData.data) resData.data = "{}";
      const resJson = JSON.parse(resData.data);

      return resJson;
    } catch (error) {
      // console.error(error);
      throw error;
    }
  }
}

export default new api({
  baseUrl: "https://u.binbot.cn",
  appKey: "fUsa8ZR4ibkXHKbNJaqeKXjgVnTGEg97",
  appId: 1002,
  appIndex: "release",
  appVer: "1.0.0"
});
