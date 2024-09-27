import MD5 from "crypto-js/md5";
import RC4 from "crypto-js/rc4";
import CryptoJS from "crypto-js";

type Uoptions = {
  baseUrl: string;
  appKey: string;
  appId: number;
  appIndex: string;
  appVer: string;
  rc4: string;
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
    form.append("time", (Date.now() / 1000).toFixed());
    let sign = MD5(`${form.toString()}${this.options.appKey}`).toString();
    if (this.options.rc4 && form.toString()) {
      let form2 = new URLSearchParams();
      form2.append(
        "data",
        RC4.encrypt(form.toString(), CryptoJS.enc.Utf8.parse(this.options.rc4)).ciphertext.toString(CryptoJS.enc.Hex)
      );
      form = form2;
    }
    form.append("sign", sign);
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
      resData.data = !resData.data
        ? "{}"
        : RC4.decrypt(
            { ciphertext: CryptoJS.enc.Hex.parse(resData.data) },
            CryptoJS.enc.Utf8.parse(this.options.rc4)
          ).toString(CryptoJS.enc.Utf8);

      return JSON.parse(resData.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new api({
  baseUrl: "https://u.binbot.cn",
  appKey: "YxrupPOFFXspbsierhsvvbdSnEKNOUe6",
  appId: 1004,
  appIndex: "release",
  appVer: "1.0.0",
  rc4: "TMXFLBNBCPMKQNUCSKUAQFWY"
});
