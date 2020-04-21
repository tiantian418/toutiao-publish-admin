<template>
  <div class="header-container">
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'

export default {
  name: 'AppHeader',
  props: {},
  components: {},
  data () {
    return {
      user: {} // 当前登录用户信息
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 除了登录接口,其它所有的接口都需要授权
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    }
  },
  created () {
    // 组件初始化后,强求获取用户资料
    this.loadUserProfile()
  },
  mounted () {}
}
</script>

<style scoped lang='less'>
.header-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}
</style>
