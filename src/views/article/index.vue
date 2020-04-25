<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form" :model="form" label-width="50px" size="mini">
      <el-form-item label="状态 :">
        <el-radio-group v-model="status">
          <!-- el-radio默认把label作为文本和选中之后的value值 -->
          <el-radio :label="null">全部</el-radio>
          <el-radio :label="0">草稿</el-radio>
          <el-radio :label="1">待审核</el-radio>
          <el-radio :label="2">审核通过</el-radio>
          <el-radio :label="3">审核失败</el-radio>
          <el-radio :label="4">已删除</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道 :">
        <el-select v-model="channelId" placeholder="请选择">
          <el-option label="全部" :value="null"></el-option>
          <el-option :label="channel.name" :value="channel.id" v-for="(channel, index) in channels" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期 :">
        <el-date-picker v-model="rangeDate" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00']" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <!-- button按钮的click事件有个默认参数,当没有指定参数的时候,会默认创建一个无用的数据 -->
        <el-button type="primary" :disabled="loading" @click="loadArticles(1)">筛选</el-button>
      </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">根据筛选条件共查询到 {{ totalCount }} 条结果：</div>
      <!-- 数据列表 -->
      <!-- table 表格组件
        1、把需要展示的数组列表数据绑定给table组件的data属性 不用v-for遍历,自己会遍历
        2、设计表格列 el-table-column width:可以设定表格列的宽度 label:可以设定列的标题 prop:用来设定要渲染的列表项数据字段，只能展示文本
        3、表格列默认只能渲染普通文本，如果需要展示其它内容(按钮,图片)，此时需要自定义表格列模板
       -->
      <el-table :data="articles" style="width: 100%" class="list-table" size="mini" v-loading="loading">
        <el-table-column prop="date" label="封面">
          <template slot-scope="scope">
            <img v-if="scope.row.cover.images[0]" class="article-cover" :src="scope.row.cover.images[0]" alt="">
            <img v-else class="article-cover" src="./no-img.gif" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="status" label="状态">
          <!-- 如果需要在自定义列模板中获取当前遍历项数据，那么就在 template 上声明 slot-scope="scope" -->
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
            <!-- <el-tag v-if="scope.row.status === 0" type="warning">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
            <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
            <el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column label="操作">
          <!-- 如果需要自定义表格列模板，则把需要自定义的内容放到 template 里面 -->
          <template slot-scope="scope">
            <el-button size="mini" type="primary" circle icon="el-icon-edit"></el-button>
            <el-button size="mini" circle type="danger" icon="el-icon-delete" @click="onDeleteArticle(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 列表分页 -->
      <!-- 如果标签之间没有内容,则结束标签可以省略 -->
      <!--
        total:设定总数据的条数 默认按照10条每页计算总页码
        page-size:每页显示条目个数
      -->
      <el-pagination layout="prev, pager, next" :total="totalCount" :page-size="pageSize" :disabled="loading" :current-page.sync="page" background @current-change="onCurrentChange"  />
    </el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'

export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      articles: [], // 文章数据列表
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      totalCount: 0, // 总数据条数
      pageSize: 10, // 每页大小
      status: null, // 查询文章的状态
      channels: [], // 文章列表频道
      channelId: null, // 查询文章的频道
      rangeDate: null, // 筛选的日期范围
      loading: true, // 表单数据加载中
      page: 1 // 当前页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles(1)
    this.loadChannels()
  },
  mounted () {},
  methods: {
    loadArticles (page = 1) {
      // 展示加载中
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        edd_pubdate: this.rangeDate ? this.rangeDate[1] : null
      }).then(res => {
        // console.log(res)
        // this.articles = res.data.data.results
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        // 关闭懒加载
        this.loading = false
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    loadChannels () {
      getArticleChannels().then(res => {
        // console.log(res)
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (articleId) {
      // console.log(articleId)
      // console.log(articleId.toString())
      this.$confirm('确认删除吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId.toString()).then(res => {
          // 删除成功,重新渲染数据
          this.loadArticles(this.page)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          message: '已取消删除',
          type: 'info'
        })
      })
    }
  }
}
</script>

<style scoped lang='less'>
.filter-card {
  margin-bottom: 25px;
}

.list-table {
  margin-bottom: 20px;
}

.article-cover {
  width: 60px;
  background-size: cover;
}
</style>
