const fs = require("fs");

function getData(filename) {
  return (req, res) => {
    const json = fs
      .readFileSync(`webpack/mock/data/${filename}.json`)
      .toString();
    const data = JSON.parse(json);
    return res.json({ code: 0, data });
  };
}
const proxy = {
  "GET /user/list": getData("userList")
};
module.exports = proxy;
