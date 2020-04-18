const merge = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const webpackConf = require("./webpack.config");

const ROOT_PATH = path.resolve(process.cwd());
const OUTPUT_PATH = `${ROOT_PATH}../../pyldapadmin/static`;

const config = merge(webpackConf, {
  mode: "production",
  output: {
    publicPath: "/static/",
    path: OUTPUT_PATH
  },
  plugins: [
    // 压缩选项
    // new UglifyJSPlugin({
    //     // sourceMap: true,
    // }),
    // devtool: 'source-map',
    // 样式分离
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].[hash:5].css",
      chunkFilename: "[name].[hash:5].css"
    }),
    new OptimizeCSSAssetsPlugin({}),
    // 清理
    new CleanWebpackPlugin()
  ]
});
config.module.rules.push(
  {
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: "css-loader",
        options: {
          minimize: true,
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
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: "css-loader",
        options: {
          minimize: true,
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
        loader: MiniCssExtractPlugin.loader
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
