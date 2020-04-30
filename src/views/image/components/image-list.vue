<template>
  <div class="image-list">
    <div class="action-head">
      <el-radio-group v-model="collect" size="mini" @change="onCollectChange">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button v-if="isShowAdd" size="mini" type="success" @click="dialogUploadVisible = true">添加素材</el-button>
    </div>

      <!-- 图片列表 -->
      <el-row :gutter="10">
        <el-col :xs="12" :sm="6" :md="6" :lg="4" v-for="(img, index) in images" :key="index" class="image-item" @click.native="selected = index">
          <el-image style="height: 145px;" :src="img.url" fit="cover"></el-image>
          <div class="selected" v-if="isShowSelected && selected === index"></div>
          <div v-if="isShowAction" class="image-action">
            <el-button type="warning" circle size="small" :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'" :loading="img.loading" @click="onCollect(img)"></el-button>
            <el-button type="danger" circle size="small" icon="el-icon-delete" :loading="img.loading" @click="onDelete(img)"></el-button>
          </div>
        </el-col>
      </el-row>

      <!-- 列表分页 -->
      <el-pagination style="margin-top:15px;" background layout="prev, pager, next" :total="totalCount" :page-size="pageSize" :current-page.sync="page" @current-change="onCurrentChange"> </el-pagination>
      <!-- 不需要发请求,自己配置 -->
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
import { getImages, collectImage, deleteImage } from '@/api/image'

export default {
  name: 'ImageList',
  components: {},
  props: {
    // 是否显示添加素材
    isShowAdd: {
      type: Boolean,
      default: true
    },
    // 是否显示图片下方的操作(收藏和删除)
    isShowAction: {
      type: Boolean,
      default: true
    },
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
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
      selected: null // 选中的索引
    }
  },
  computed: {},
  watch: {},
  created () {
    // 页面初始化加载第一页
    this.loadImages(1)
  },
  mounted () {},
  methods: {
    // 有默认值的参数作为最后一个参数
    loadImages (page = 1) {
      // 重置高亮代码,防止数据和页码不对应
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        // console.log(res)
        const results = res.data.data.results
        results.forEach(img => {
          // 控制每个收藏按钮的loading状态
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },

    onCollectChange (value) {
      this.loadImages(1, value)
    },

    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 重新渲染素材列表
      this.loadImages(this.page)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },

    onCurrentChange (page) {
      // 当页码改变的时候重新渲染素材列表
      this.loadImages(page)
    },

    onCollect (img) {
      // 展示loading
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        // 更新视图状态
        img.is_collected = !img.is_collected
        // 关闭loading
        img.loading = false
      })
    },

    onDelete (img) {
      img.loading = true
      deleteImage(img.id).then(res => {
        // 重新加载数据列表
        this.loadImages(this.page)
        img.loading = false
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

.image-item {
  position: relative;
}

.image-action {
  font-size: 25px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: #fff;
  height: 40px;
  background-color: rgba(204, 204, 204, .5);
  position: absolute;
  bottom: 4px;
  left: 5px;
  right: 5px;
}
.selected {
  background: url(./selected.png) no-repeat;
  background-size: cover;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
