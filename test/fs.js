const fs = require("fs");

const city = process.argv[2].split("=")[1];
const keywords = process.argv[3].split("=")[1];

console.log(city, keywords);
// fs.mkdir("./data/2020-1-1", (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Directory created successfully!");
//   }
// });
// fs.writeFile("./data/2020-1-1/test.txt", "Hello World", (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("File created successfully!");
//   }
// });
