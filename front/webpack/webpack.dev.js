const merge = require("webpack-merge");

const webpackConf = require("./webpack.config");
// 测试服务器配置
const DEV_SERVER_CONF = require("./webpack.server.js");

const config = merge(webpackConf, {
  output: {
    filename: "[name].js",
    chunkFilename: "[name].js"
  },
  devtool: "source-map",
  mode: "development",
  devServer: DEV_SERVER_CONF
});

config.module.rules.push(
  {
    test: /\.css$/,
    use: [
      {
        loader: "style-loader"
      },
      {
        loader: "css-loader",
        options: {
          modules: true,
          localIdentName: "[local]"
        }
      }
    ]
  },

  {
    test: /\.less$/,
    exclude: /node_modules/,
    use: [
      {
        loader: "style-loader"
      },
      {
        loader: "css-loader",
        options: {
          modules: true,
          localIdentName: "[name]_[local]__[hash:base64:5]"
        }
      },
      {
        loader: "less-loader",
        options: {
          javascriptEnabled: true
        }
      }
    ]
  },

  {
    test: /\.less$/,
    include: /node_modules/,
    use: [
      {
        loader: "style-loader"
      },
      {
        loader: "css-loader"
      },
      {
        loader: "less-loader",
        options: {
          // 主题变量
          modifyVars: {},
          javascriptEnabled: true
        }
      }
    ]
  }
);

module.exports = config;
