// 该配置文件必须导出一个对象(node中的模块语法)
module.exports = {
  // 自定义VueCLI中的webpack配置
  configureWebpack: {
    // 告诉webpack使用script标签加载的那个资源,而不是去node_modules中打包处理
    externals: {
      // 属性名: 加载的包名
      // 属性值: script标签暴露的全局变量
      // 注意: 写到字符串中
      'vue': 'Vue',
      'element-ui': 'ELEMENT',
      'echarts': 'echarts'
    }
  }
}