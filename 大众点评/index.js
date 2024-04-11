const cheerio = require("cheerio");
const { getPageContent, writeFs } = require("../lib");
const { replaceTemplate } = require("../lib/utils");

const { formatTime } = require("../lib/date");

const cityMap = {};
cityMap[(cityMap[1] = "上海")] = 1;
cityMap[(cityMap[2] = "北京")] = 2;
cityMap[(cityMap[134] = "南昌")] = 134;

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
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
      "cache-control": "max-age=0",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "cross-site",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      cookie:
        "fspop=test; _lxsdk_cuid=18ec72de6fac8-02fe0bb9bcd48e-26001a51-1fa400-18ec72de6fac8; _lxsdk=18ec72de6fac8-02fe0bb9bcd48e-26001a51-1fa400-18ec72de6fac8; _hc.v=73a1137d-06c9-96f6-2ec8-5c1ae8d4bbf7.1712738658; WEBDFPID=27165ww1738v5595ywv4590x7yv5747u81vx27wuu3z979585y92w566-2028098665005-1712738665005AIQGAMIfd79fef3d01d5e9aadc18ccd4d0c95074184; ctu=6a3872b1f6016a45f7eadb503f47fe82f7403ee11440a6734fbf2292dfec06e4; s_ViewType=10; Hm_lvt_602b80cf8079ae6591966cc70a3940e7=1712738659,1712806570; cy=110; cye=hefei; qruuid=0cdb3b81-aaca-4ffe-9056-3a467b571060; _lx_utm=utm_source%3DBaidu%26utm_medium%3Dorganic; Hm_lpvt_602b80cf8079ae6591966cc70a3940e7=1712819495; _lxsdk_s=18ecbcbad3b-fb0-453-827%7C%7C623",
      Referer: url,
      "Referrer-Policy": "strict-origin-when-cross-origin",
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
    });

    pageNum++;

    if (pageNum >= 35) {
      clearInterval(timer);

      writeFs(dataDir + `${keywords}-${cityMap[city]}.json`, map);
      return;
    }

    timer = setTimeout(arguments.callee, Math.random() * 1000 * 10 + 2000);
  }, Math.random() * 1000 * 5 + 2000);
}

main();
