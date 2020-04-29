// 全局事件通信总线
// 作用:可以让任何组件之间相互通信

import Vue from 'vue'

export default new Vue()

// a组件要给b组件发送数据
// 语法

// b 注册通信事件
// import globalBus from '@/views/global-bus'
// globalBus.$on('foo', (data) => {
//   // 处理函数
// })

// a 发布通信事件
// import  globalBus from '@/views/global-bus'
// globalBus.$emit('bar',12323)

// 注意:通信的两端使用的事件名称必须一致,否则无效

// 同理 b要给a发送数据 就是a注册通信事件,b发布通信事件
