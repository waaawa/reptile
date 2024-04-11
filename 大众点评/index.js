const cheerio = require("cheerio");
const { getPageContent, writeFs } = require("../lib");
const { replaceTemplate } = require("../lib/utils");

const { formatTime } = require("../lib/date");

const cityMap = {};
cityMap[(cityMap[1] = "上海")] = 1;
cityMap[(cityMap[2] = "北京")] = 2;
cityMap[(cityMap[3] = "杭州")] = 3;
cityMap[(cityMap[134] = "南昌")] = 134;
cityMap[(cityMap[14] = "福州")] = 14;
cityMap[(cityMap[17] = "西安")] = 17;
cityMap[(cityMap[16] = "武汉")] = 16;
cityMap[(cityMap[110] = "合肥")] = 110;
cityMap[(cityMap[8] = "成都")] = 8;
cityMap[(cityMap[9] = "重庆")] = 9;
cityMap[(cityMap[4] = "广州")] = 4;
cityMap[(cityMap[160] = "郑州")] = 160;

let $order = process.argv[4].split("=")[1];

$order =
  $order === "智能"
    ? ""
    : $order === "好评"
    ? "o3"
    : $order === "人气"
    ? "o2"
    : $order === "评价最多"
    ? "o11"
    : "";

const $city = process.argv[2].split("=")[1];
const $keywords = process.argv[3].split("=")[1];

// let $order = "";

// const $city = "南昌";
// const $keywords = "ktv";

// 大众点评 接口地址
const urlTemplate = `https://www.dianping.com/search/keyword/{city}/0_{keywords}/{order}p{pageNum}`;

// 数据存储地址
const dataDir = `./data/${formatTime(new Date(), "yyyy-MM-dd")}/`;

// 商店ID
// const shopId = "#shop-all-list li .promo-icon a" + "attr:data-shopid";
// 商店名称
// const shopName = "#shop-all-list li h4" + "text";

/** BEGIN---------团购信息---------BEGIN */
// const tuangouItem = "#shop-all-list li .svr-info .si-deal a:not(first-of-type)";

// const tuangouItemContent = "href|([^/]+)$";
// const tuangouItemId = "text";
/** END---------团购信息---------END */

// 商铺人均
// const shopAvgPrice = "#shop-all-list li .mean-price b" + "text";
// 商铺标签
// const shopTags = "#shop-all-list li .tag-addr a:nth-of-type(1) span" + "text";
// 商铺地址
// const shopAddress =
//   "#shop-all-list li .tag-addr a:nth-of-type(2) span" + "text";

async function getCityShopInfoList(city, keywords, pageNum) {
  const url = replaceTemplate(urlTemplate, {
    city,
    keywords: encodeURIComponent(keywords),
    pageNum,
    order: $order,
  });

  let shopList = [];

  const res = await getPageContent(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language":
        "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
      Connection: "keep-alive",
      Cookie:
        "fspop=test; cy=134; cye=nanchang; _lx_utm=utm_source%3Dbaidu%26utm_medium%3Dorganic%26utm_term%3D%25E5%25A4%25A7%25E4%25BC%2597%25E7%2582%25B9%25E8%25AF%2584; _lxsdk_cuid=18ecc408dffc8-0a13b1169e3c5a-d535429-1fa400-18ecc408dffc8; _lxsdk_s=18ecc408dff-997-9f5-2e4%7C%7C94; _lxsdk=18ecc408dffc8-0a13b1169e3c5a-d535429-1fa400-18ecc408dffc8; _hc.v=b14bed35-c9a6-8004-8bfb-3af318185370.1712823767; WEBDFPID=x5z99z2x77yw547105z8zyv5z7vu739w81vxx59u06u9795861uuyx71-2028183794388-1712823794388MCCAKAE10f02007e9804b0b4cf483cebf1f9f513650; qruuid=f951761e-e8ab-4056-9f9c-81e73786fdb7; dper=02027422d1ebec9eff92ab466a70dd5d746de484393ab65664105c632a7e73949e0491f729f63daad5bc78cb113a1277b73d08cc0dfd787c443c00000000521f00002afdc055e3fa84cd162473d17ffcc43702c5fc40470ffcf6a16390845146128fc2ec08ced97c0d11a9b0750dc885cb4a; ll=7fd06e815b796be3df069dec7836c3df; Hm_lvt_602b80cf8079ae6591966cc70a3940e7=1712823850; Hm_lpvt_602b80cf8079ae6591966cc70a3940e7=1712823943; s_ViewType=10",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "cross-site",
      "Sec-Fetch-User": "?1",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      Referer: url,
      method: "GET",
      body: null,
    },
  });

  const $ = cheerio.load(res);

  shopList = $("#shop-all-list li").map((i, el) => {
    const shop = {
      id: $(el).find(".promo-icon a").attr("data-shopid"),
      name: $(el).find("h4").text(),
      avgPrice: $(el).find(".mean-price b").text(),
      tags: $(el).find(".tag-addr a:nth-of-type(1) span").text(),
      address: $(el).find(".tag-addr a:nth-of-type(2) span").text(),
      // tuangou: [],
    };

    // $(el)
    //   .find(".svr-info .si-deal a:not(first-of-type)")
    //   .each((i, el) => {
    //     const item = {
    //       id: $(el)
    //         .attr("href")
    //         .match(/([^//]+)$/)[1],
    //       content: $(el).text(),
    //     };
    //     shop.tuangou.push(item);
    //   });

    return shop;
  });

  // console.log(shopList);

  return [...shopList];
}

function main() {
  let pageNum = 1;

  const map = {};

  // const keys = ["网吧", "ktv", "餐饮"];

  const keywords = $keywords;

  const city = cityMap[$city];

  let timer = setTimeout(function () {
    clearTimeout(timer);

    getCityShopInfoList(city, keywords, pageNum).then((data) => {
      data.forEach((e) => {
        map[e.id] = e;
      });

      pageNum++;

      if (pageNum >= 30) {
        clearTimeout(timer);

        writeFs(dataDir + `${keywords}-${cityMap[city]}.json`, map);
        return;
      }

      timer = setTimeout(arguments.callee, Math.random() * 1000 * 15 + 5000);
    });
  }, 1000);
}

main();
