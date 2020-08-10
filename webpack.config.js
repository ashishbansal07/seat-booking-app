const path = require('path');

  module.exports = {
    mode: 'development',
    entry: "./src/index.js",
    // devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    devServer: {
        contentBase: path.join(__dirname, "public/"),
        port: 8080,
        publicPath: "http://localhost:8080/public/",
        hotOnly: true
    },
    output: {
        path: path.resolve(__dirname, "public/"),
        publicPath: "/",
        filename: "main.js"
    },
  };
