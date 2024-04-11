const { isDate, isNumber, isString } = require("./is");

const timeMap = {
  ms: 1,
  s: 1000,
  m: 6e4,
  h: 36e5,
  d: 864e5,
};

/**
 * 获取对应时间
 * @param {keyof timeMap} key
 * @returns {number}
 */
function getTime(key) {
  return timeMap[key];
}

/**
 * 获取指定类型时间戳范围
 * @param {'today'|'week'|'month'|'year'} type - 时间范围类型
 * @returns {[number, number]} - 包含起始时间戳和结束时间戳的数组
 */
function getTimestampRange(type) {
  const start = new Date();
  const end = new Date();

  if (type === "today") {
    // 将时间设置为午夜
    start.setHours(0, 0, 0, 0);
    // 将时间设置为晚上11:59:59
    end.setHours(23, 59, 59, 999);
  } else if (type === "week") {
    // 获取本周的第一天
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    // 获取本周的最后一天
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  } else if (type === "month") {
    // 获取本月的第一天
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    // 获取本月的最后一天
    end.setMonth(start.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);
  } else if (type === "year") {
    // 获取本年的第一天
    start.setMonth(0);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    // 获取本年的最后一天
    end.setMonth(11);
    end.setDate(31);
    end.setHours(23, 59, 59, 999);
  }

  return [start.getTime(), end.getTime()];
}

function toDate(date) {
  if (!(isNumber(date) || isString(date) || isDate(date))) return null;
  date = isNaN(date) ? date : +date;
  date = isNumber(date) ? date : Date.parse(date);
  if (isNaN(date)) return null;
  return new Date(date);
}

/**
 * 转为时间戳
 * @param {string|number|Date} date
 * @param {keyof timeMap | number} minPrecision default 's'
 * @returns {number|null}
 */
function toTimestamp(date, minPrecision) {
  date = toDate(date);

  if (date === null) return 0;

  date = date.getTime();
  const pre = isNumber(minPrecision)
    ? minPrecision
    : timeMap[minPrecision] || timeMap.s;

  return Math.floor(date / pre) * pre;
}

/**
 * 格式化时间
 * @param {number|string|Date} date
 * @param {string} fmt
 * @param {{pre: number}} options
 * @returns {string|null}
 */
function formatTime(date, fmt) {
  date = toDate(date);
  if (date === null) return null;

  if (!fmt) fmt = "yyyy-MM-dd hh:mm:ss";

  var o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "h+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  const yearMatchRes = /(y+)/.exec(fmt);
  if (yearMatchRes) {
    fmt = fmt.replace(
      yearMatchRes[1],
      (date.getFullYear() + "").substring(4 - yearMatchRes[1])
    );
  }
  for (var k in o) {
    let res = new RegExp("(" + k + ")").exec(fmt);
    if (res) {
      fmt = fmt.replace(
        res[1],
        res[1] === 1 ? o[k] : ("00" + o[k]).substring(("" + o[k]).length)
      );
    }
  }
  return fmt;
}

module.exports = {
  getTime,
  getTimestampRange,
  toDate,
  toTimestamp,
  formatTime,
};
