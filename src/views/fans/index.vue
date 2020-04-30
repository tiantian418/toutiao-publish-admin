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
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="first"></el-tab-pane>
        <el-tab-pane label="粉丝画像" name="second">
          <!-- 1.为echarts准备一个有宽高的容器 -->
          <div ref="main" style="width:600px;height:400px"></div>
        </el-tab-pane>
      </el-tabs>
      <!-- 分页 -->
      <el-pagination style="margin-top:15px;" background layout="prev, pager, next" :total="1000"></el-pagination>
    </el-card>
  </div>
</template>

<script>
// 2.加载echarts
import echarts from 'echarts'

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
  // 注意:初始化操作 DOM 一定要写到 mounted 钩子函数中
  mounted () {
    // 3.基于准备好的dom,初始化echarts实例
    var myCharts = echarts.init(this.$refs.main)
    // 4.指定图标的配置型和数据
    var option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    }
    // 5.使用指定的配置项和数据显示图表
    myCharts.setOption(option)
  },
  methods: {}
}
</script>

<style scoped lang='less'>
</style>
