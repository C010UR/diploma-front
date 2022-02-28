import { createApp } from "vue";
import ElementPlus from "element-plus";
import App from "./App.vue";
import baseForm from "../../shared/components/baseForm.vue";
import "../../shared/styles/element/style.scss";

createApp(App).use(ElementPlus).component("base-form", baseForm).mount("#app");
