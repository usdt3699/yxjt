const path = require("path");
module.exports = {
  // outputDir: 'dist-bxfp',
  lintOnSave: false, //关闭语法检查
  devServer: {
    // open: process.platform === 'darwin', // 在 macOS 上自动打开浏览器
    host: "0.0.0.0", // 允许外部ip访问
    port: 50327, // 端口号
    https: false, // 是否启用https
    hotOnly: true, // 热更新
    contentBase: "./public", // 本地服务器所加载的页面所在的目录
    proxy: {
      "/api": {
        target: "http://admin.hopqac.org",
        // target: "https://adminapi.testone.cc",
        // target: "https://api.baixingfupin.com",
        // pathRewrite: {"^/apiV1": ""},
        // ws: true, //用于支持websocket
        changeOrigin: true, //用于控制请求头中的host值
      },
    },
  },
  //开启代理服务器（方式一）
  /* devServer: {
    proxy: 'http://localhost:5000'
  }, */
  //开启代理服务器（方式二）
  // devServer: {
  //     proxy: {
  //         "/stage-api": {
  //             target: "http://japi.tokphone.top",
  //             // target: "http://japi.caizhengbu.net",
  //             // pathRewrite: { "^/apiV1": "" },
  //             // ws: true, //用于支持websocket
  //             changeOrigin: true, //用于控制请求头中的host值
  //         },
  //         "/api": {
  //             // target: 'http://47.119.194.94:8001',
  //             // target: "http://api.tokphone.top",
  //             target: "http://zjhg-api.wzcs.net",
  //             pathRewrite: {"^/apiV1": ""},
  //             // ws: true, //用于支持websocket
  //             changeOrigin: true, //用于控制请求头中的host值
  //         },
  //     },
  // },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [require("tailwindcss"), require("autoprefixer")],
      },
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        modifyVars: {
          // 直接覆盖变量
          "@primary-color": "#F49F00", // 全局主色
          "@nav-bar-icon-color": "#fff", // 返回按钮颜色
          "@nav-bar-background-color": "#F49F00", // 标题栏背景颜色
          "@nav-bar-title-text-color": "#fff", // 标题栏背景颜色
          "@tabbar-item-icon-img-height": "26px", // vant tabbar图标大小
          "@tabbar-item-font-size": "14px", // vant tabbar字体大小
          "@tabbar-background-color": "transparent", // vant tabbar字体大小
          "@nav-bar-arrow-size": "18px", // vant tabbar字体大小
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          // hack: `true; @import "your-less-file-path.less";`,
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  },
  chainWebpack: (config) => {
    // 修改图片处理规则，提高图片质量
    config.module
      .rule("images")
      .use("url-loader")
      .tap((options) => {
        return {
          ...options,
          limit: 10000, // 小于10kb的图片会被转为base64
          quality: 100, // 图片质量
        };
      });
  },
};
