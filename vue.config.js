const { defineConfig } = require("@vue/cli-service");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
const Components = require("unplugin-vue-components/webpack");

if (process.env.NODE_ENV === "production") {
  const commonConfig = {
    publicPath: "/",
    transpileDependencies: true
  };
  result = defineConfig({
    configureWebpack: {
      plugins: [
        Components({
          resolvers: [ElementPlusResolver()]
        }),
        require("unplugin-element-plus/webpack")({
          useSource: true
        })
      ]
    },
    css: {
      loaderOptions: {
        scss: {
          additionalData: '@use "./shared/styles/element/style.scss" as *;'
        }
      }
    },
    pages: {
      index: {
        entry: "request-app/src/main.js",
        filename: "index.html",
        title: "Заявка на ремонт",
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
    css: {
      loaderOptions: {
        scss: {
          additionalData: '@use "./shared/styles/element/style.scss" as *;'
        }
      }
    },
    configureWebpack: {
      plugins: [
        Components({
          resolvers: [ElementPlusResolver()]
        }),
        require("unplugin-element-plus/webpack")({
          useSource: true
        })
      ]
    },
    devServer: {
      port: process.env.APP_TYPE === "request-app" ? 8080 : 7070
    }
  });
}

module.exports = result;
