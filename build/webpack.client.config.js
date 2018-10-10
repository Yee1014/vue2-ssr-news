const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Category = require('../src/config/category');

const isProd = process.env.NODE_ENV === 'production'

const config = merge(base, {
  entry: {
    app: './src/entry-client.js'
  },
  resolve: {
    alias: {
      'create-api': './create-api-client.js'
    }
  },
  module: {
    rules: [
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
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: isProd // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    runtimeChunk: {
      name: "manifest"
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"client"'
    }),
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[chunkhash].css' : '[name].css',
      chunkFilename: isProd ?  '[id].[chunkhash].css': '[id].css',
    }),
    new VueSSRClientPlugin()
  ]
})

if (process.env.NODE_ENV === 'production') {
  const categories = Category.map(category => category.title).join('|');
  const categoryUrlPattern = new RegExp('^/(' + categories + ')');
  config.plugins.push(
  // auto generate service worker
  new SWPrecachePlugin({
    cacheId: 'vue-hn',
    filename: 'service-worker.js',
    minify: false,
    dontCacheBustUrlsMatching: /./,
    staticFileGlobsIgnorePatterns: [
      /\.map$/, /\.json$/
    ],
    runtimeCaching: [
      {
        urlPattern: '/',
        handler: 'networkFirst'
      }, {
        urlPattern: categoryUrlPattern,
        handler: 'networkFirst'
      }
    ]
  }))
}

module.exports = config
