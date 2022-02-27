const path = require("path");
const { defineConfig } = require("@vue/cli-service");

const isRequestApp = process.env.APP_TYPE === "request-app";
const appDir = isRequestApp ? "request-app" : "dashboard-app";

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: path.resolve(__dirname, `${appDir}/dist`),
  devServer: {
    port: isRequestApp ? 8080 : 7070
  }
});
