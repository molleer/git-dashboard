import { createApp } from "vue";
import "@mdi/font/css/materialdesignicons.css";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Routes
import { createWebHistory, createRouter } from "vue-router";

// Components
import App from "./App.vue";
import DashboardView from "./views/DashboardView.vue";
import ConfigView from "./views/ConfigView.vue";

const vuetify = createVuetify({
  components,
  directives,
});

// Routes
const routes = [
  { path: "/", component: DashboardView },
  { path: "/config", component: ConfigView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).use(vuetify).mount("#app");
