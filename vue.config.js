const { defineConfig } = require("@vue/cli-service");

let result;

if (process.env.NODE_ENV === "production") {
  const commonConfig = {
    publicPath: process.env.NODE_ENV === "production" ? "/public/" : "/",
    transpileDependencies: true
  };
  result = defineConfig({
    pages: {
      index: {
        entry: "request-app/src/main.js",
        filename: "index.html",
        title: "Завка на ремонт",
        ...commonConfig
      },
      dashboard: {
        entry: "dashboard-app/src/main.js",
        filename: "dashboard.html",
        title: "Администрирование заявками на ремонт",
        ...commonConfig
      }
    }
  });
} else {
  result = defineConfig({
    devServer: {
      port: process.env.APP_TYPE === "request-app" ? 8080 : 7070
    }
  });
}

module.exports = result;
