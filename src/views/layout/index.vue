<template>
    <el-container class="layout-container">
      <el-aside class="aside" width="200px">
        <app-aside class="aside-menu" />
      </el-aside>
      <el-container>
        <el-header class="header">
          <div>
            <i class="el-icon-s-fold"></i>
            <span>江苏传智播客科技教育有限公司</span>
          </div>
          <el-dropdown>
            <div class="avatar-wrap">
              <img class="avatar" :src="user.photo" alt="">
              <span>{{ user.name }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人设置</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main class="main">
          <!-- 子路由出口 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user'
// import AppHeader from './components/header'

export default {
  name: 'LayoutIndex',
  data () {
    return {
      user: {} // 当前登录用户信息
    }
  },
  components: {
    AppAside
    // AppHeader
  },
  created () {
    // 组件初始化后,请求获取用户资料
    this.loadUserProfile()
  },
  methods: {
    // 除了登录接口,其它所有的接口都需要授权
    loadUserProfile () {
      getUserProfile().then(res => {
        // console.log(res)
        this.user = res.data.data
      })
    }
  }
}
</script>

<style scoped lang="less">
  .layout-container {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .aside {
    background-color: #d3dce6;
    .aside-menu {
      height: 100%;
    }
  }

  .header {
    // background-color: #b3c0d1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }

  .main {
    background-color: #e9eef3;
  }

  .avatar-wrap {
  display: flex;
  align-items: center;
  .avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
}
</style>
