import axios from 'axios'

// 配置封装axios
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 请求的基础路径
})

// 导出请求方法
export default request
