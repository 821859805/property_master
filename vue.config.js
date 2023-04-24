const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {           //拦截api开头的请求，并用下面域名替换原域名实现跨域访问
        target: 'http://localhost:8086'   //跨域的域名
      }
    }
  }
})
