const path = require('path')
const webpack = require('webpack')
const {VueLoaderPlugin} = require('vue-loader')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const resolve = dir => path.join(__dirname, '../', dir)
const isProd = process.env.NODE_ENV === 'production'

const base = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'cheap-eval-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
    chunkFilename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
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
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        )
      }, {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[ext]?[hash]'
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[ext]?[hash]'
        }
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
  const base = [new VueLoaderPlugin()]
  const dev = [new FriendlyErrorsPlugin()]
  const prod = []
  return base.concat(isProd ? prod : dev)
}

// 查看打包内容
if (process.env.analyz_config_report) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    base.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = base;
