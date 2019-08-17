let HtmlWebpackPlugin = require("html-webpack-plugin"),
  manifest = require("../manifest.json"),
  fs = require("fs"),
  fsExtra = require("fs-extra"),
  path = require("path"),
  webpack = require("webpack"),
  VueLoaderPlugin = require("vue-loader/lib/plugin"),
  WriteFilePlugin = require("write-file-webpack-plugin");

// generates the manifest file using the package.json informations
manifest.description = process.env.npm_package_description;
manifest.version = process.env.npm_package_version;

// clean de dist folder
fsExtra.emptyDirSync(path.join(__dirname, "../build"));

fs.writeFileSync(
  path.join(__dirname, "../build/manifest.json"),
  JSON.stringify(manifest)
);

module.exports = {
  target: "web",
  entry: {
    popup: path.join(__dirname, "../src", "js", "popup.js"),
    options: path.join(__dirname, "../src", "js", "options.js"),
    background: path.join(__dirname, "../src", "js", "background.js")
  },
  output: {
    path: path.join(__dirname, "../build"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [{ loader: "babel-loader" }],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          emitError: false,
          emitWarning: true
        }
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{ loader: "file-loader?name=img/[name].[ext]" }]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [{ loader: "file-loader?name=font/[name].[ext]" }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      "process.BROWSER": true
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../src", "popup.html"),
      filename: "popup.html",
      chunks: ["popup"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../src", "options.html"),
      filename: "options.html",
      chunks: ["options"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../src", "background.html"),
      filename: "background.html",
      chunks: ["background"]
    }),
    new VueLoaderPlugin(),
    new WriteFilePlugin()
  ]
};
