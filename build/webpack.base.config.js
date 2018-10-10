const path = require('path')
const webpack = require('webpack')
const {VueLoaderPlugin} = require('vue-loader')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const resolve = dir => path.join(__dirname, '../', dir)
const isProd = process.env.NODE_ENV === 'production'

const base = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'cheap-eval-source-map', // 'cheap-module-source-map'
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      'public': path.resolve(__dirname, '../public')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: resolve("src")
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        )
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.styl(us)?$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          {
            loader: 'css-loader'
          },
          'stylus-loader'
        ],
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          {
            loader: 'css-loader'
          },
          'less-loader',
        ],
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: false
  },
  plugins: setPlugin()
}

function setPlugin() {
  const base = [
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[chunkhash].css' : '[name].css',
      chunkFilename: isProd ?  '[id].[chunkhash].css': '[id].css',
    }),
    new VueLoaderPlugin()
  ]
  const dev = [
    new FriendlyErrorsPlugin()
  ]
  const prod = []
  return base.concat(isProd ? prod : dev)
}

// 查看打包内容
if (process.env.analyz_config_report) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    base.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = base;
