<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo"></div>
      </div>
      <!-- 配置form表单验证:
         1.必须给el-form组件绑定model为表单数据对象
         2.给需要验证的表单项el-form-item绑定prop属性(prop需要制定表单对象中的数据名称)
         3.通过el-form组件的rules属性配置验证规则
       -->
      <el-form class="login-form" ref="login-form"  :model="user" :rules="formRules">
        <el-form-item prop="mobile">
          <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" :loading="loginLoading" @click="onLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '', // 验证码
        agree: false
      },
      // checked: false, // 是否同意协议的选中状态
      loginLoading: false, // 登录的loading状态
      formRules: {
        // 表单验证规则 要验证的数据名称:规则列表[]
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { pattern: /^1[3|5|7|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式' }
        ],
        agree: [
          {
            // 验证通过:callback()
            // 验证失败:callback(new Error('错误消息))
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请勾选用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLogin () {
      // 获取表单数据(根据接口要求绑定数据)
      // const user = this.user

      // 表单验证
      // validate方法是异步的
      this.$refs['login-form'].validate(valid => {
        // 如果表单验证失败,则停止请求
        if (!valid) {
          return
        }
        // 验证通过,请求登录
        this.login()
      })
    },
    login () {
      // 开启登录中 loading...
      this.loginLoading = true
      // 把所有的请求封装成函数,便于维护
      login(this.user).then(res => {
        console.log(res)

        // 登录成功
        this.$message({
          message: '登录成功',
          type: 'success'
        })

        // 关闭loading
        this.loginLoading = false

        // 跳转到首页
        // this.$router.push('/')
        this.$router.push({ name: 'home' })
      }).catch(err => {
        console.log('登录失败', err)
        this.$message.error('登录失败,手机号或验证码错误')

        // 关闭loading
        this.loginLoading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("./login_bg.jpg") no-repeat;
  background-size: cover;
  .login-form-wrap {
    min-width: 300px;
    padding: 30px 50px 10px;
    background-color: #fff;
    .login-head {
      display: flex;
      justify-content: center;
      .logo {
        width: 200px;
        height: 57px;
        margin-top: 15px;
        background: url("./logo_index.png") no-repeat;
        background-size: contain;
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
      }
    }
  }
}
</style>
