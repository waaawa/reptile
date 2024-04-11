const request = require("request");
// const cheerio = require("cheerio");

const fs = require("fs");

/**
 *
 * @param {string} url
 * @param {request.CoreOptions} options
 * @returns
 */
function getPageContent(url, options) {
  return new Promise((resolve, reject) => {
    request(url, options, (err, res, body) => {
      if (!err && res) {
        resolve(body);
      } else {
        reject();
      }
    });
  });
}

function writeFs(url, data) {
  const dir = url.split("/").slice(0, -1).join("/");

  if (!fs.existsSync(dir)) {
    fs.mkdir(dir, (err) => {
      if (err) {
        throw err;
      }

      console.log("Directory created!");
    });
  }

  fs.writeFile(url, JSON.stringify(data), (err) => {
    if (err) {
      throw err;
    }

    console.log("File saved!");
  });
}

module.exports = {
  getPageContent,
  writeFs,
};
