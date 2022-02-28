const path = require("path");
const { defineConfig } = require("@vue/cli-service");

const isRequestApp = process.env.APP_TYPE === "request-app";
const appDir = isRequestApp ? "request-app" : "dashboard-app";
const pubDir = isRequestApp ? "/request/" : "/dashboard/";

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: path.resolve(__dirname, `${appDir}/dist`),
  publicPath: process.env.NODE_ENV === "production" ? pubDir : "/",
  devServer: {
    port: isRequestApp ? 8080 : 7070
  }
});
