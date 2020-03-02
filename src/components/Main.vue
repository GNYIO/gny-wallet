<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content">
            <span>GNY Web Wallet</span>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content">
            <span>Latest Block Height: {{ blockHeight }}</span>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content">
            <el-button @click="logout" type="info">Logout</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <el-menu
          class="el-menu-vertical"
          default-active="1"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-menu-item index="1" route="/home">
            <i class="el-icon-s-home"></i>
            <span> Home</span>
          </el-menu-item>

          <el-menu-item index="2" route="/transaction">
            <i class="el-icon-s-promotion"></i>
            <span> Transaction</span>
            <router-link to="/transaction"></router-link>
          </el-menu-item>

          <el-menu-item index="3" route="/delegates">
            <i class="el-icon-user-solid"></i>
            <span> Delegates</span>
          </el-menu-item>

          <el-menu-item index="4" route="/machinelearning">
            <i class="el-icon-s-platform"></i>
            <span> Machine Learning</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import * as Cookie from 'tiny-cookie';

export default {
  data() {
    return {
      blockHeight: this.$store.getters.latestBlock.height,
    };
  },
  methods: {
    logout() {
      Cookie.remove('bip39');
      this.$store.dispatch('setToken', null);
      this.$store.dispatch('setUser', null);
      this.$router.push('/login');
    },
  },
};
</script>

<style>
.el-header {
  background-color: #5c89a8;
  color: #fff;
  text-align: justify;
  line-height: 60px;
  font-family: 'Courier New', Courier, monospace;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
  height: 100vh;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
  font-family: 'Courier New', Courier, monospace;
}

.el-menu {
  background-color: #545c64;
  color: #fff;
}
</style>
