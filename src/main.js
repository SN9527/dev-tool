import Vue from "vue"
import App from "./App.vue"

import axios from "axios"
Vue.prototype.$axios = axios


import "element-ui/lib/theme-chalk/index.css"
import ElementUI from "element-ui"
Vue.use(ElementUI)


import VMdEditor from "@kangc/v-md-editor";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import hljs from "highlight.js";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import "@kangc/v-md-editor/lib/theme/style/github.css";
VMdEditor.use(githubTheme, {
  	Hljs: hljs
})
Vue.use(VMdEditor);


import "@/assets/directive.js"


Vue.config.productionTip = false
new Vue({render: h => h(App)}).$mount("#app")