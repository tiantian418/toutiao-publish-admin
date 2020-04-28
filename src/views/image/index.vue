<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
          <!-- 面包屑路径导航 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
            <el-breadcrumb-item>素材管理</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="action-head">
        <el-radio-group v-model="collect" size="mini" @change="onCollectChange">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button size="mini" type="success" @click="dialogUploadVisible = true">添加素材</el-button>
      </div>
      <!-- 图片列表 -->
      <el-row :gutter="10">
        <el-col :xs="12" :sm="6" :md="6" :lg="4" v-for="(img, index) in images" :key="index">
          <el-image style="height: 100px" :src="img.url" fit="cover"></el-image>
          <div class="image-icons">
            <span class="el-icon-star-off icon-cang" @click="isCollect(!img.is_collected, img.id)"></span>
            <span class="el-icon-delete icon-del" @click="delImage(img.id)"></span>
          </div>
        </el-col>
      </el-row>
      <!-- 列表分页 -->
      <el-pagination style="margin-top:15px;" background layout="prev, pager, next" :disabled="loading" :total="totalCount" :page-size="pageSize" :current-page.sync="page" @current-change="onCurrentChange"> </el-pagination>
    </el-card>
    <el-dialog title="上传素材" :visible.sync="dialogUploadVisible" :append-to-body="true">
      <el-upload class="upload-demo" drag action="http://ttapi.research.itcast.cn/mp/v1_0/user/images" :headers="uploadHeaders" name="image" multiple :show-file-list="false" :on-success="onUploadSuccess">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, isCollectImage } from '@/api/image'

export default {
  name: 'ImageIndex',
  components: {},
  props: {},
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false, // 默认查询全部图片列表
      images: [], // 图片列表
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      loading: false, // 是否显示加载中
      pageSize: 12, // 每页显示条数
      totalCount: 0, // 总数据条数
      page: 1, // 当前页码
      imageCollect: false // 当前图片是否收藏
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages(false)
  },
  mounted () {},
  methods: {
    loadImages (collect = false, page) {
      // 加载中
      this.loading = true
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        // console.log(res)
        const { results, total_count: totalCount } = res.data.data
        this.images = results
        this.totalCount = totalCount
        // 关闭加载中
        this.loading = false
      })
    },

    onCollectChange (value) {
      this.loadImages(value)
    },

    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 重新渲染素材列表
      this.loadImages(false)
    },

    onCurrentChange (page) {
      // 当页码改变的时候重新渲染素材列表
      this.loadImages(page)
    },

    isCollect (isCollected, imageId) {
      isCollectImage(isCollected, imageId).then(res => {
        // console.log(res)
        // 收藏成功,刷新页面
        this.loadImages(this.page)
      })
    }
  }
}
</script>

<style scoped lang='less'>
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.image-icons {
  position: relative;
  // bottom: 4px;
  // margin: 0 auto;
  // width:90%;
  // height: 28px;
  // line-height: 28;
  // text-align: center;
  .icon-cang, .icon-del {
    margin: 0, 15px;
  }
}
</style>
