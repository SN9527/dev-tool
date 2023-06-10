import Vue from "vue"
import App from "./App.vue"

import axios from "axios"
Vue.prototype.$axios = axios


import "element-ui/lib/theme-chalk/index.css"
import ElementUI from "element-ui"
Vue.use(ElementUI)


import VMdEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import "@kangc/v-md-editor/lib/theme/style/github.css";

import createLineNumbertPlugin from "@kangc/v-md-editor/lib/plugins/line-number/index";
VMdEditor.use(createLineNumbertPlugin())

import "@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css";
import createTodoListPlugin from "@kangc/v-md-editor/lib/plugins/todo-list/index";
VMdEditor.use(createTodoListPlugin())

import createMermaidPlugin from "@kangc/v-md-editor/lib/plugins/mermaid/npm";
import "@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css";
VMdEditor.use(createMermaidPlugin())

import "@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css";
import createCopyCodePlugin from "@kangc/v-md-editor/lib/plugins/copy-code/index";
VMdEditor.use(createCopyCodePlugin())

import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import hljs from "highlight.js";
VMdEditor.use(githubTheme, {
  	Hljs: hljs
})
Vue.use(VMdEditor);



import "@/assets/directive.js"


Vue.config.productionTip = false
new Vue({render: h => h(App)}).$mount("#app")