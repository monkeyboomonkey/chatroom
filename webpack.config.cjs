const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  entry: {
    main: "./src/client/index.js",
    // login: "./src/client/login.js",
    // profile: "./src/client/profile.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist", "client"),
    // publicPath: '/' // needs to be project root for HtmlWebpackPlugin, ./ does not work
  },
  module: {
    rules: [
      {
        test: /.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, "src", "client"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"]
          }
        },
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'url-loader',
        },
      },
    ],
  },

  devServer: {
    static: {
      publicPath: "/", // URL mapped to folder
      directory: path.resolve(__dirname, "dist", "client"), // Folder where index.html is
    },
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        secure: false,
      },
      "/session": {
        target: "http://localhost:3001",
        secure: false,
      },
    },
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({template: "src/client/index.html",}),
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: "src/client/index.html",
    //   chunks: ['main'],
    //   inject: false
    // }),
  ],
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js', '.jsx', '.scss'],
  },
};
