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
      <el-form ref="publish-form"  label-width="70px" :model="article" :rules="formRules">
        <el-form-item label="标题 :" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容 :" prop="content">
          <el-tiptap v-model="article.content" :extensions="extensions" height="350" placeholder="请输入文章内容"></el-tiptap>
        </el-form-item>
        <el-form-item label="封面 :">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- v-model="article.cover.images[index]" 给子组件传递了一个名字叫 value 的数据 :value="article.cover.images[index]" 默认监听 input 事件，当事件发生，它会让绑定数据 = 事件参数 @input="article.cover.images[index] = 事件参数" -->
          <template v-if="article.cover.type > 0">
            <upload-cover :key="cover"  v-for="(cover, index) in article.cover.type" v-model="article.cover.images[index]" />
          </template>
        </el-form-item>
        <el-form-item label="频道 :" prop="channel_id">
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
import UploadCover from './components/upload-cover'
import { getArticleChannels, addArticle, getArticle, updateArticle } from '@/api/article'
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Image,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  CodeBlock,
  TextColor
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image'

export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover
  },
  props: {},
  data () {
    return {
      channels: [], // 文章列表频道
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: { // 文章封面
          type: 1, // 封面类型
          images: [] // 封面图片的地址
        },
        channel_id: null
      },
      // 编辑器的 extensions
      // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }), // 标题的级别
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          uploadRequest (file) {
            // 接口要求Content-Type是multipart/form-data,所有这里使用FormData
            const fd = new FormData()
            fd.append('image', file)
            // 返回Promise对象(因为axios本身就是返回Promise的)
            return uploadImage(fd).then(res => {
              // 返回结果
              // console.log(res)
              return res.data.data.url
            })
          }
        }),
        new Underline(), // 下划线
        new Italic(), // 斜体
        new Strike(), // 删除线
        new HorizontalRule(), // 分割线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(),
        new Fullscreen(), // 全屏
        new CodeBlock(), // 代码块
        new TextColor() // 文本颜色
      ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          {
            validator (rule, value, callback) {
              // console.log('content validator')
              if (value === '<p></p>') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请输入文章频道' }
        ]
      }
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
      this.$refs['publish-form'].validate(valid => {
        // 验证失败,停止表单提交
        if (!valid) {
          return
        }
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
      })
    },
    // 修改文章:加载文章内容
    loadArticle () {
      // console.log('loadArticle')
      getArticle(this.$route.query.id).then(res => {
        // 模板绑定展示
        this.article = res.data.data
      })
    },
    onUpdateCover (index, url) {
      this.article.cover.images[index] = url
    }
  }
}
</script>

<style scoped lang='less'>
</style>
