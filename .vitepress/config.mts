import { defineConfig } from 'vitepress'
import { set_sidebar } from "./utils/auto-sidebar.mjs";
console.log(set_sidebar("mark_file/vue"))
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "WEB前端博客",
  description: "一个独属于我的博客",
  head: [
    // 增加一个自定义的 favicon(网页标签的图标)
    ['link', { rel: 'icon', href: '/image/boke.png' }],
    // 用来处理在移动端，搜索框在获得焦点时会放大，并且在失去焦点后可以左右滚动
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
  ],
  themeConfig: {
    logo: '/image/bokezhuanjia.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'JS语法', link: '/mark_file/javascript/' },
      { text: 'VUE框架', link: '/mark_file/vue/' }
    ],
    sidebar: {
      "mark_file/javascript/": set_sidebar("mark_file/javascript"),
      "mark_file/vue/": set_sidebar("mark_file/vue"),
    },
    // algolia搜索
    // search: {
    //   provider: 'algolia',
    //   options: ,
    // },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    footer: {
      copyright: '版权开始@2024 Mr. Xia'
    }
  }
})
