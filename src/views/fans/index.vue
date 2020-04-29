<template>
  <div class="fans-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 粉丝列表 -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="粉丝列表" name="first"></el-tab-pane>
        <el-tab-pane label="粉丝画像" name="second"></el-tab-pane>
      </el-tabs>
      <!-- 分页 -->
      <el-pagination style="margin-top:15px;" background layout="prev, pager, next" :total="1000"></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'FansIndex',
  components: {},
  props: {},
  data () {
    return {
      activeName: 'second'
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style scoped lang='less'>
</style>
