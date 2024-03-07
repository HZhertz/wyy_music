<template>
  <header class="header">
    <div class="menu"></div>

    <div :class="isLogin ? 'user-avatar' : 'login'">
      <div class="logined" v-if="true">
        <el-image src="../assets/img/disc_bg.png" class="avatar">
          <div slot="placeholder" class="image-slot">
            <i class="iconfont icon-placeholder"></i>
          </div>
        </el-image>
        <span class="nickname">nickname </span>
        <span class="set"><i class="iconfont icon-set"></i></span>
        <span class="quit"><i class="iconfont icon-quit"></i></span>
      </div>
      <span class="login-btn" v-else>登录</span>
    </div>
  </header>
</template>
<script setup></script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  background-color: #ba5252;
}
.menu {
  flex: 1;
}
.user-avatar {
  padding: 5px 0 5px 20px;
  text-align: center;

  .avatar {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 100%;
    overflow: hidden;
    cursor: pointer;
  }

  .logined {
    display: flex;
    align-items: center;

    span {
      display: inline-block;
      height: 24px;
      line-height: 24px;
      font-weight: 300;
      padding: 0 10px;
      cursor: pointer;
    }

    .iconfont {
      color: var(--color-text-main);
      vertical-align: top;
    }
  }
}
.login {
  padding: 0 20px;
  text-align: center;

  .login-btn {
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
