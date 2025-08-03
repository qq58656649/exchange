import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // 加载 .env 配置

const app = express();
const PORT = process.env.PORT || 3000;

// 定义交易所和跳转规则（从环境变量读取）
const exchangeMap = {
  binance: {
    China: process.env.BINANCE_URL_CN,
    default: process.env.BINANCE_URL_DEFAULT,
  },
  gateio: {
    China: process.env.GATEIO_URL_CN,
    default: process.env.GATEIO_URL_DEFAULT,
  },
  bitget: {
    China: process.env.BITGET_URL_CN,
    default: process.env.BITGET_URL_DEFAULT,
  },
  okx: {
    China: process.env.OKX_URL_CN,
    default: process.env.OKX_URL_DEFAULT,
  },
  coinw: {
    China: process.env.COINW_URL_CN,
    default: process.env.COINW_URL_DEFAULT,
  },
  weex: {
    China: process.env.WEEX_URL_CN,
    default: process.env.WEEX_URL_DEFAULT,
  },
};

app.get("/", async (req, res) => {
  try {
    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const exchangeParam = Object.keys(req.query)[0]?.toLowerCase();

    const geoResponse = await fetch(`https://get.geojs.io/v1/ip/geo/${clientIp}.json`);
    const geoData = await geoResponse.json();
    const country = geoData.country;

    let targetUrl = "";
    if (exchangeParam && exchangeMap[exchangeParam]) {
      const exchange = exchangeMap[exchangeParam];
      targetUrl = exchange[country] || exchange.default;
    } else {
      const defaultExchange = exchangeMap["gateio"];
      targetUrl = defaultExchange[country] || defaultExchange.default;
    }

    res.redirect(targetUrl);
  } catch (error) {
    console.error("跳转失败：", error);
    res.status(500).send("服务器内部错误");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
