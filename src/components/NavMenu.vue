<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
        default-active="1"
        class="el-menu-vertical"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <el-menu-item index="1" route="/home">
          <icon name="home"></icon>
          <span slot="title"> Home</span>
        </el-menu-item>
        <el-menu-item index="2" route="/transaction">
          <icon name="arrows-alt-h"></icon>
          <span slot="title"> Transaction</span>
        </el-menu-item>
        <el-menu-item index="3" route="/delegates">
          <icon name="user-friends"></icon>
          <span slot="title"> Delegates</span>
        </el-menu-item>
        <el-menu-item index="4" route="/machinelearning">
          <icon name="desktop"></icon>
          <span slot="title"> Machine Learning</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style scoped></style>
