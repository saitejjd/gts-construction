const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development', // Change to 'production' for production builds
  entry: './src/index.js', // Entry point for your application
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true, // Cleans the output directory before each build
  },
  devtool: 'source-map', // Helps with debugging
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Serve static files from the 'public' directory
    },
    port: 5000, // Development server port
    open: true, // Automatically open the browser
    hot: true, // Enable hot module replacement
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Proxy API requests to the backend server
        changeOrigin: true,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Transpile JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.css$/, // Process CSS files
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/, // Process image files
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/, // Process font files
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Template HTML file
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: 'public' }, // Copy static files to the output directory
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(), // Minimize CSS
      new TerserPlugin(), // Minimize JavaScript
    ],
    splitChunks: {
      chunks: 'all', // Split vendor and application code
    },
  },
  devServer: {
    static: {
        directory: path.join(__dirname, 'public'),
    },
    proxy: [
        {
            context: ['/api'], // Match paths starting with '/api'
            target: 'http://localhost:3000', // Replace with your backend server URL
            changeOrigin: true,
        },
    ],
},
};