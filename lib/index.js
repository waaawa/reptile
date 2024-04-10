const request = require("request");
// const cheerio = require("cheerio");

const fs = require("fs");

export function getPageContent(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (!err && res) {
        resolve(body);
      } else {
        reject();
      }
    });
  });
}

export function writeFs(data, url) {
  fs.writeFile(url, JSON.stringify(data), (err) => {
    if (err) {
      throw err;
    }

    console.log("File saved!");
  });
}
