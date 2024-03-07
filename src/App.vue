<template>
  <el-container>
    <el-aside><Sidebar></Sidebar></el-aside>
    <el-main>
      <Header></Header>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'
</script>

<style></style>
