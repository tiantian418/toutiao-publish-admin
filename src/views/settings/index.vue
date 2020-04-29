<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="15">
          <el-form ref="form" :model="user" label-width="100px" :rules="formRules">
            <el-form-item label="编号 :"> {{ user.id }} </el-form-item>
            <el-form-item label="手机 :"> {{ user.mobile }} </el-form-item>
            <el-form-item label="媒体名称 :" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍 :" prop="intro">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱 :" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="updateProfileLoading" @click="onUpdateUser">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2" :span="4">
          <label for="file">
            <el-avatar shape="square" :size="150" fit="cover" :src="user.photo"></el-avatar>
            <p>点击修改头像</p>
          </label>
          <input id="file" type="file" hidden ref="file" @change="onFileChange">
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="修改头像" :visible.sync="dialogVisible" append-to-body @opened="onDialogOpened">
      <div class="preview-image-wrap">
        <img class="preview-image" :src="previewImage" ref="preview-image">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="updatePhotoLoading" @click="onUpdatePhoto">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'

export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false, // 控制上传图片裁切预览的显示状态
      previewImage: '', // 预览图片
      cropper: null, // 裁剪器示例
      updatePhotoLoading: false, // 更新用户头像loading状态
      updateProfileLoading: false, // 更新用户基本信息loading状态
      // 表单验证
      formRules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入媒体介绍', trigger: 'blur' },
          { min: 1, max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () {},
  methods: {
    onUpdateUser () {
      this.updateProfileLoading = true
      // 提交表单
      const { name, intro, email } = this.user
      updateUserProfile({
        name,
        intro,
        email
      }).then(res => {
        this.$message({
          type: 'success',
          message: '保存个人信息成功'
        })
        this.updateProfileLoading = false

        // 更新顶部登录用户的信息
        globalBus.$emit('update-user', this.user)
      })
    },
    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onFileChange () {
      // console.log('file change')
      // 图片预览
      const file = this.$refs.file

      const blobData = window.URL.createObjectURL(file.files[0])

      this.previewImage = blobData

      // 展示弹出层,预览用户选择的图片
      this.dialogVisible = true

      // 解决选择相同文件不触发change事件
      this.$refs.file.value = ''
    },
    onDialogOpened () {
      // 基于ing进行初始化,但img必须是可见状态,这里要在对话框里面初始化裁剪器,就需要在对话框完全打开的状态去进行初始化
      // 获取图片 DOM 节点
      const image = this.$refs['preview-image']
      // 初始化裁剪器
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'none',
        cropBoxResizable: false
      })
    },
    onUpdatePhoto () {
      // 展示loading状态
      this.updatePhotoLoading = true
      // 获取裁剪的图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        // 请求更新用户头像
        updateUserPhoto(fd).then(res => {
          // console.log(res)
          // 把服务端返回的数据进行展示
          // this.user.photo = res.data.data.photo
          // 关闭对话框
          this.dialogVisible = false
          // 把裁剪结果的文件对象转为blob数据本地预览
          this.user.photo = window.URL.createObjectURL(file)
          // 关闭loading状态
          this.updatePhotoLoading = false
          this.$message({
            type: 'success',
            message: '更新头像成功'
          })
          // 更新顶部登录用户的信息
          globalBus.$emit('update-user', this.user)
        })
      })
    }
  }
}
</script>

<style scoped lang='less'>
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
