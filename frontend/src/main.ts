// Vue
import { createApp } from "vue";

// App
import App from "./App.vue";
import router from "./router";

// Styles
import "./style.css";

createApp(App).use(router).mount("#app");
