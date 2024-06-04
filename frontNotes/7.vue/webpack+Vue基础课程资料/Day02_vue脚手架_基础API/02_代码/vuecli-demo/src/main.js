// 项目入口-webpack打包从这开始

import Vue from 'vue' // 引入vue源码
import App from './App.vue' // 引入App.vue文件模块

Vue.config.productionTip = false // 一个控制台打印的提示

new Vue({ // 实例化Vue(传入配置对象)
  render: h => h(App), // 告诉vue渲染什么
}).$mount('#app') // '渲染到哪里