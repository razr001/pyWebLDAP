/**
 * Created by a on 2017/10/23.
 */
const apiMocker = require("webpack-api-mocker");
const path = require("path");

// 获取npm run 后面的命令
const TARGET = process.env.npm_lifecycle_event;
const MOCK = TARGET == "mock";
// 端口
const port = 9000;

module.exports = {
  historyApiFallback: true,
  hot: true,
  inline: true,
  progress: true,
  host: "0.0.0.0",
  port,
  before(app) {
    apiMocker(app, path.resolve("webpack/mock/api.js"));
  },
  // 代理
  proxy: {
    "/api/mock": {
      target: `http://127.0.0.1:${port}`,
      secure: true,
      changeOrigin: true,
      pathRewrite: { "^/api/mock": "" }
    },

    "/api": {
      target: "http://localhost:5000",
      secure: true,
      changeOrigin: true
      // pathRewrite: { "^/api": "" }
    }
  }
};
