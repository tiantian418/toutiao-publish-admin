import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'
// 非组件模块可以加载使用 element 的 message 提示组件
import { Message } from 'element-ui'

// 配置封装axios
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 请求的基础路径
  transformResponse: [function (data) {
    // 后端返回的数据可能不是JSON格式的字符串,为了不报错,此时使用try-catch来捕获异常,处理异常的发生
    try {
      // axios默认在内部使用的是JSON.parse来转换处理原始数据
      // 如果转换成功,则直接返回结果
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      // 如果转换失败,则原封不动的直接返回给请求使用
      return data
    }
  }]
})

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

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 注意：一定要把响应结果 return，否则真正发请求的位置拿不到数据
  return response
}, function (error) {
  const { status } = error.response
  if (status === 401) {
    // 跳转到登录页面 清除本地存储中的而用户登录状态
    window.localStorage.removeItem('user')
    router.push('/login')
    Message.error('登录状态无效，请重新登录')
  } else if (status === 403) {
    // token 未携带或已过期
    Message({
      type: 'warning',
      message: '没有操作权限'
    })
  } else if (status === 400) {
    // 客户端参数错误
    Message.error('参数错误，请检查请求参数')
  } else if (status >= 500) {
    Message.error('服务端内部异常，请稍后重试')
  }
  return Promise.reject(error)
})

// 导出请求方法
export default request
