<template>
  <div class="comment-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 数据列表 -->
      <!-- table 表格组件
        1、把需要展示的数组列表数据绑定给table组件的data属性 不用v-for遍历,自己会遍历
        2、设计表格列 el-table-column width:可以设定表格列的宽度 label:可以设定列的标题 prop:用来设定要渲染的列表项数据字段，只能展示文本
        3、表格列默认只能渲染普通文本，如果需要展示其它内容(按钮,图片)，此时需要自定义表格列模板
       -->
      <el-table class="table-list" :data="articles" style="width: 100%">
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
        <el-table-column prop="address" label="评论状态">
          <template slot-scope="scope"> {{scope.row.comment_status ? '正常' : '关闭'}} </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.comment_status" active-color="#13ce66" inactive-color="#ff4949" :disabled="scope.row.statusDisabled" @change="onStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination style="margin-top:20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page" :page-sizes="[20, 40, 80, 100]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" background />
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'

export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data () {
    return {
      articles: [], // 文章数据列表
      totalCount: 0, // 总条数
      pageSize: 10, // 每页显示条数
      page: 1 // 当前激活的页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
  },
  mounted () {},
  methods: {
    handleSizeChange () {
      this.loadArticles(1)
    },
    handleCurrentChange (page) {
      // 页码改变,重新渲染页码数据
      this.loadArticles(page)
    },
    loadArticles (page = 1) {
      // 使分页组件激活的页码和请求数据的页码保持一致
      this.page = page
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        // console.log(res)
        const { results } = res.data.data
        results.forEach(article => {
          article.statusDisabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      // 禁用开关
      article.statusDisabled = true
      // 请求 提交 修改
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        // 启用开关
        article.statusDisabled = true
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
        })
      })
    }
  }
}
</script>

<style scoped lang='less'>
.tabel-list {
  margin-bottom: 30px;
}
</style>
