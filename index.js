import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// 定义交易所和跳转规则
const exchangeMap = {
  binance: {
    China: "https://www.marketwebb.systems/zh-CN/join?ref=VF1LAX99",
    default: "https://www.binance.com/zh-CN/join?ref=VF1LAX99",
  },
  gateio: {
    China: "https://www.gatewebsite.com/share/BTCKUTOP",
    default: "https://www.gate.io/share/BTCKUTOP",
  },
  bitget: {
    China: "https://www.sanqianwenhua.xyz/expressly?channelCode=fmx2&vipCode=e7xs1048",
    default: "https://www.bitget.com/expressly?channelCode=fmx2&vipCode=e7xs1048",
  },
  okx: {
    China: "https://www.lfjnatsgfn.com/join/1852501",
    default: "https://www.okx.com/join/1852501",
  },
  coinw: {
    China: "https://www.coinw.vin/register?r=2XT9Y63J",
    default: "https://www.coinw.com/front/invitePublicity?r=2XT9Y63J&language=zh_TW",
  },
  weex: {
    China: "https://wxfyyh.info/register?channelCode=mywm20231209&vipCode=ljkn",
    default: "https://www.weex.com/register?channelCode=mywm20231209&vipCode=ljkn",
  },
};

app.get("/", async (req, res) => {
  try {
    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    // 获取 URL 参数中的交易所名称
    const exchangeParam = Object.keys(req.query)[0]?.toLowerCase();

    // 调用 GeoJS API 获取地理位置信息
    const geoResponse = await fetch(`https://get.geojs.io/v1/ip/geo/${clientIp}.json`);
    const geoData = await geoResponse.json();
    const country = geoData.country;

    // 打印调试信息
    //console.log("Client IP:", clientIp);
    //console.log("Geo Data:", geoData);
    
    // 根据交易所参数和国家跳转
    let targetUrl = "";
    if (exchangeParam && exchangeMap[exchangeParam]) {
      const exchange = exchangeMap[exchangeParam];
      targetUrl = exchange[country] || exchange.default;
    } else {
      // 未指定交易所参数时，默认跳转 Gate.io
      const defaultExchange = exchangeMap["gateio"];
      targetUrl = defaultExchange[country] || defaultExchange.default;
    }

    // 跳转到目标地址
    res.redirect(targetUrl);
  } catch (error) {
    console.error("跳转失败：", error);

    // 如果检测失败，仍根据交易所参数跳转到默认地址
    this.redirectOnFailure();
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
