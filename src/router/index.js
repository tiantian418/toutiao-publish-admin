import Vue from 'vue'
import VueRouter from 'vue-router'
// 在vue中,@表示src目录,就是src路径后面别忘了写 斜杠
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout/'
import Article from '@/views/article/'

Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '', // path为空,会作为默认子路由渲染
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫:
// to:要去的路由信息
// from:来自哪里的路由信息
// next:放行方法,允许通过
router.beforeEach((to, from, next) => {
  // 如果访问的页面不是登录页面,则效验登录状态
  // 如果没有登录,则跳转到登录页面
  // 如果登录了,则允许通过 next()
  const user = JSON.parse(window.localStorage.getItem('user'))

  // 校验非登录页面的登录状态
  if (to.path !== '/login') {
    if (user) {
      // 已登录,允许通过
      next()
    } else {
      // 没有登录,跳转到登录页面
      next('/login')
    }
  } else {
    // 登录页面,允许通过
    next()
  }
})

export default router
