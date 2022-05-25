const  copyWebpackPlugin= require("copy-webpack-plugin");
const path = require('path')
const {
  CheckerPlugin,
  TsConfigPathsPlugin
} = require('awesome-typescript-loader')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  context: resolve('src'),

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss'],
    plugins: [new TsConfigPathsPlugin()]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader', 'source-map-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'awesome-typescript-loader']
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: isProduction ? MiniCssExtractPlugin.loader : 'style-loader'
          },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              // fiber: require('fibers')
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new MiniCssExtractPlugin({
      // only work in production mode
      filename: '[name].[contenthash:6].css',
      chunkFilename: '[id].css'
    }),

    new HtmlWebpackPlugin({
      filename: 'yrecord.html',
      template: resolve('public/index.html'),
      inject: true
    }),
    new copyWebpackPlugin([{
      from: path.join(__dirname,'..','/public/code'),//静态资源路径
      to:''//跟随code目录存放在dist根路径目录下
  }]),
  ],

  performance: {
    hints: false
  }
}
