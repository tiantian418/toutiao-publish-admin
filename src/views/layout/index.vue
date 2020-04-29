<template>
    <el-container class="layout-container">
      <el-aside class="aside" width="auto">
        <app-aside class="aside-menu" :is-collapse="isCollapse" />
      </el-aside>
      <el-container>
        <el-header class="header">
          <div>
            <i :class="{'el-icon-s-fold': isCollapse, 'el-icon-s-unfold': !isCollapse}" @click="isCollapse = !isCollapse"></i>
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
              <!-- 组件默认是不识别原声事件的,除非内部做了处理 -->
              <el-dropdown-item @click.native="onLogout">退出登录</el-dropdown-item>
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
import globalBus from '@/utils/global-bus'

export default {
  name: 'LayoutIndex',
  data () {
    return {
      user: {}, // 当前登录用户信息
      isCollapse: false // 侧边菜单栏的展示状态
    }
  },
  components: {
    AppAside
    // AppHeader
  },
  created () {
    // 组件初始化后,请求获取用户资料
    this.loadUserProfile()

    // 注册自定义事件,当事件发布以后,就会调用
    globalBus.$on('update-user', (data) => {
      // this.user = data  // 不能这么做,对象之间赋值的是引用,会呆滞相互影响的问题
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  methods: {
    // 除了登录接口,其它所有的接口都需要授权
    loadUserProfile () {
      getUserProfile().then(res => {
        // console.log(res)
        this.user = res.data.data
      })
    },
    onLogout () {
      this.$confirm('确认退出吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 把用户的登录状态清除
        window.localStorage.removeItem('user')
        // 跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
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
    // background-color: #d3dce6;
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
    background-color: #fff;
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
