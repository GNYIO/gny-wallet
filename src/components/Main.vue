<template>
  <el-container direction="vertical" class="page-container">
    <el-header>
      <div><b>GNY Web Wallet</b></div>
      <div v-if="width > 1000" class="left-margin">
        <span>Latest Block Height: {{ latestBlock.height }}</span>
      </div>
      <div v-if="width > 1000" class="left-margin">
        <span>Current Network: {{ network }}</span>
      </div>
      <div class="right">
        <el-button @click="toggleMenu">Show Menu</el-button>
      </div>
    </el-header>

    <el-main>
      <router-view class="router"></router-view>
    </el-main>

    <el-menu router v-if="isMenuToggled">
      <el-menu-item index="1" route="/home">
        <i class="el-icon-s-home"></i>
        <span> Home</span>
      </el-menu-item>

      <el-menu-item index="2" route="/transfer">
        <i class="el-icon-s-promotion"></i>
        <span> Transfer</span>
      </el-menu-item>

      <el-menu-item index="3" route="/delegates">
        <i class="el-icon-user-solid"></i>
        <span> Delegates</span>
      </el-menu-item>

      <el-menu-item index="4" route="/assets">
        <i class="el-icon-s-order"></i>
        <span> Assets</span>
      </el-menu-item>

      <el-menu-item index="5" route="/machinelearning">
        <i class="el-icon-s-platform"></i>
        <span> Machine Learning</span>
      </el-menu-item>

      <el-menu-item index="6" route="/swapgate_eth">
        <i class="el-icon-s-platform"></i>
        <span> Ethereum Swapgate</span>
      </el-menu-item>
      <el-menu-item index="7" route="/swapgate_bsc">
        <i class="el-icon-s-platform"></i>
        <span> BSC Swapgate</span>
      </el-menu-item>

      <el-menu-item index="8">
        <el-button style="width: 100%" @click="logout" type="info">Logout</el-button>
      </el-menu-item>
    </el-menu>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      network: '',
    };
  },
  computed: {
    ...mapGetters(['latestBlock', 'isMenuToggled', 'width']),
  },
  methods: {
    toggleMenu() {
      this.$store.dispatch('toggleMenu');
    },
    logout() {
      this.$store.dispatch('resetState', null);
      this.$router.push('/login');
    },
  },
  mounted() {
    const networkEnv = process.env['VUE_APP_GNY_NETWORK'];
    this.network = networkEnv.charAt(0).toUpperCase() + networkEnv.slice(1);
  },
};
</script>

<style>
.page-container {
  position: relative;
  min-height: 100vh;
}

.el-header {
  background-color: #5c89a8;
  color: #fff;
  text-align: justify;
  line-height: 60px;
  display: flex;
}
.el-header .left-margin {
  margin-left: 30px;
}
.el-header .right {
  margin-left: auto;
}

@media screen and (min-width: 1040px) {
  .el-main {
    width: 1040px;
  }
}

.el-menu {
  position: absolute;
  z-index: 10;
  height: 100%;
  width: 300px;
  top: 60px;
  right: 0px;
  border-left: 1px solid darkgray;
}

.router {
  display: flex;
  flex-wrap: wrap;
}
</style>
