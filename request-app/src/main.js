import { createApp } from "vue";
import ElementPlus from "element-plus";
import App from "./App.vue";
import baseForm from "../../shared/components/base/baseForm.vue";
import "element-plus/dist/index.css";

createApp(App).use(ElementPlus).component("base-form", baseForm).mount("#app");
