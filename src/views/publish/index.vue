<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章'}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表单 -->
      <el-form ref="form" :model="article" label-width="40px">
        <el-form-item label="标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="article.content"></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="article.channel_id" placeholder="请选择">
            <el-option :label="channel.name" :value="channel.id" v-for="(channel, index) in channels" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getArticleChannels, addArticle, getArticle, updateArticle } from '@/api/article'

export default {
  name: 'PublishIndex',
  components: {},
  props: {},
  data () {
    return {
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: { // 文章封面
          type: 0, // 封面类型
          images: [] // 封面图片的地址
        }
      },
      channels: [], // 文章列表频道
      channel_id: null
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
    // 判断路由路径中参数中是否有id,如果有,则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () {},
  methods: {
    loadChannels () {
      getArticleChannels().then(res => {
        // console.log(res)
        this.channels = res.data.data.channels
      })
    },
    onPublish (draft = false) {
      // 如果是编辑文章,则执行修改操作,否则执行发表操作
      const articleId = this.$route.query.id
      if (articleId) {
        // 执行编辑文章
        updateArticle(articleId, this.article, draft).then(res => {
          // console.log(res)
          this.$message({
            type: 'success',
            message: `${draft ? '存入草稿' : '修改成功'}`
          })
          // 跳转到内容管理页面
          this.$router.push('/article')
        })
      } else {
        // 执行发表文章
        addArticle(this.article, draft).then(res => {
          // console.log(res)
          this.$message({
            type: 'success',
            message: `${draft ? '存入草稿' : '发布成功'}`
          })
          // 跳转到内容管理页面
          this.$router.push('/article')
        })
      }
    },
    // 修改文章:加载文章内容
    loadArticle () {
      // console.log('loadArticle')
      getArticle(this.$route.query.id).then(res => {
        // 模板绑定展示
        this.article = res.data.data
      })
    }
  }
}
</script>

<style scoped lang='less'>
</style>
