/**
 * 字符串模板替换函数
 * @example replaceTemplate('{prefix}', {prefix: 'aaa'}) // "aaa"
 * @param {string} template
 * @param {Object} params
 * @returns
 */
function replaceTemplate(template, params) {
  // 使用正则表达式匹配模板中的占位符，例如'{prefix}'
  var regex = /\{([^{}]+)\}/g;

  // 使用replace方法进行替换
  var result = template.replace(regex, function (match, key) {
    // 如果参数中存在与占位符对应的键值，则替换为参数的值，否则保持不变
    return params.hasOwnProperty(key) ? params[key] : match;
  });

  return result;
}

module.exports = {
  replaceTemplate: replaceTemplate,
};
