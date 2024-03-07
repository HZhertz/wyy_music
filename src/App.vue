<template>
  <el-container>
    <el-aside>
      <Sidebar></Sidebar>
    </el-aside>
    <el-main>
      <Header></Header>
      <router-view></router-view>
    </el-main>
    <Login v-show="loginDialogVisible" />
  </el-container>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'
import Login from '@/components/Login.vue'

import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const loginDialogVisible = computed(() => store.getters.loginDialogVisible)
</script>

<style></style>
