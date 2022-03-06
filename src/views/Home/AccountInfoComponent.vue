<template>
  <el-card shadow="hover">
    <div slot="header">
      <span>Account Info</span>
    </div>

    <p v-if="user.username">
      Username: {{ user.username }}
    </p>
    <p>
      Address: {{ user.address }}
    </p>
    <p>
      Balance: {{ user.balancePretty }} GNY
    </p>
    <p>
      Is Locked: {{ user.lockHeight === '0' ? 'No' : 'Yes' }}
    </p>
    <p v-if="user.lockHeight !== '0'">
      Lock Height: {{ user.lockHeight }}
    </p>
    <p v-if="user.lockHeight !== '0'">
      Lock Amount: {{ user.lockAmountPretty }} GNY
    </p>
    <p v-if="user.secondPublicKey">
      Has Second Secret:
      {{ user.secondPublicKey === null ? 'No' : 'Yes' }}
    </p>
    <p v-if="user.secondPublicKey">
      Second PublicKey: {{ user.secondPublicKey }}
    </p>
  </el-card>
</template>

<script>
export default {
  props: {
    user: Object,
  },
};
</script>

<style scoped>
.el-card {
  text-align: left;
  width: 500px;
  max-width: 500px;
  margin: 0 auto;
}
</style>
