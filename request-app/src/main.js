import { createApp } from "vue";
import App from "./App.vue";
import baseForm from "../../shared/components/baseForm.vue";

createApp(App).component("base-form", baseForm).mount("#app");
