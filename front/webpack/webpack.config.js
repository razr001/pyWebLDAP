/**
 * Created by a on 2017/10/23.
 */
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");

const ROOT_PATH = path.resolve(process.cwd());
const APP_PATH = `${ROOT_PATH}/src`;
const ENTRY_PATH = `${APP_PATH}/entries`;
const OUTPUT_PATH = `${ROOT_PATH}/dist`;

const publicPath = "/";

const commonConf = {
  entry: {
    main: `${ENTRY_PATH}/index.js`
    // vendor,
  },
  output: {
    publicPath,
    path: OUTPUT_PATH,
    filename: "[name].[hash:5].js",
    chunkFilename: "[name].[hash:5].js"
  },
  // 默认import的后缀名
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    modules: ["node_modules", APP_PATH],
    alias: {
      src: APP_PATH
    }
  },
  optimization: {
    // webpack4
    splitChunks: {
      chunks: "async",
      minSize: 100000,
      cacheGroups: {
        // antd: {
        //   name: "antd",
        //   test: /antd/,
        //   priority: 10,
        // },
        // react: {
        //   name: "react",
        //   priority: 10,
        //   test: /react/,
        // },
        // echarts: {
        //   name: "echarts",
        //   test: /echarts/,
        //   priority: 10,
        // },
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        }
      }
    }
  },
  plugins: [
    // 生成index.html
    new HtmlWebpackPlugin({
      title: "My web",
      filename: "index.html",
      template: `${ENTRY_PATH}/index.html`,
      hash: false
    }),
    // 自动加载的模块
    // new webpack.ProvidePlugin({
    // 	$: "jquery",
    // }),
    // 复制文件
    new CopyWebpackPlugin([
      {
        context: APP_PATH,
        from: "config/config.json",
        to: "config/config.json"
      },
      { context: APP_PATH, from: "resources/images", to: "resources/images" },
      { context: APP_PATH, from: "resources/fonts", to: "resources/fonts" }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 4096
            }
          }
        ]
      },

      {
        test: /.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [{ loader: "babel-loader" }]
      },
      {
        test: /\.(eot|svg|ttf|woff)$/,
        loader: "file-loader"
      }
    ]
  }
};

module.exports = commonConf;
