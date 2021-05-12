import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all";
import { User } from "@/helpers";
import VueChatScroll from "vue-chat-scroll";

import { auth } from "@/firebase"; // get authentication features from firebase

Vue.config.productionTip = false;
Vue.use(VueChatScroll);

Vue.component("Notifications", () => import("@/components/Notifications"));

auth.onAuthStateChanged(function(user) {
  if (user) {
    const res = User({ user: user });
    store.dispatch("user/setUser", res);
    store.dispatch("user/getChatList");
    router.push("/")
  }
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
});
