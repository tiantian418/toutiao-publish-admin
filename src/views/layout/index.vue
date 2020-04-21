<template>
  <div class="layout-container">
    <el-container>
      <el-aside class="aside" width="200px">
        <app-aside class="aside-menu" />
      </el-aside>
      <el-container>
        <el-header class="header">
            <app-header />
        </el-header>
        <el-main class="main">
          <!-- 子路由出口 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AppAside from './components/aside'
import AppHeader from './components/header'

export default {
  name: 'LayoutIndex',
  components: {
    AppAside,
    AppHeader
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
</style>
