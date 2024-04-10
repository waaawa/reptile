const cheerio = require("cheerio");

const cityMap = {
  1: "上海",
  2: "北京",
};

// 大众点评 接口地址
const urlTemplate = `https://www.dianping.com/search/keyword/{city}/{keywords}/p{pageNum}`;

// 数据存储地址
const dataDir = `./data/${new Date().toLocaleDateString()}/data.json`;

// 商店ID
const shopId = "#shop-all-list li .promo-icon a" + "attr:data-shopid";
// 商店名称
const shopName = "#shop-all-list li h4" + "text";

/** BEGIN---------团购信息---------BEGIN */
const tuangouItem = "#shop-all-list li .svr-info .si-deal a:not(first-of-type)";

const tuangouItemContent = "href|([^/]+)$";
const tuangouItemId = "text";
/** END---------团购信息---------END */

// 商铺人均
const shopAvgPrice = "#shop-all-list li .mean-price b" + "text";
// 商铺标签
const shopTags = "#shop-all-list li .tag-addr a:nth-of-type(1) span" + "text";
// 商铺地址
const shopAddress =
  "#shop-all-list li .tag-addr a:nth-of-type(2) span" + "text";
