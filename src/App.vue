<template>
  <el-container>
    <el-header class="header">
      <page-header />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <nav-menu></nav-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavMenu from "./components/NavMenu";
import PageHeader from "./components/Header";

export default {
  name: "app",
  components: {
    NavMenu,
    PageHeader
  }
};
</script>

<style>
.header {
  background-color: #0a68ab;
  color: #fff;
  line-height: 60px;
}
</style>
