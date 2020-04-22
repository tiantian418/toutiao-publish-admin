import axios from 'axios'

// 配置封装axios
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 请求的基础路径
})

// 导出请求方法
export default request

// 请求拦截器
request.interceptors.request.use(
  // 所有请求都会经过这里
  // config是当前请求相关的配置信息对象
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // 如果有登录用户信息,则统一设置token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 当return config之后请求会真正的发出去
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
