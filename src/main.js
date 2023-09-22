import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap-sass/assets/stylesheets/_bootstrap.scss";
import "vue2-animate/dist/vue2-animate.min.css";

new Vue({
  el: "#app",
  render: h => h(App),
  router
});
