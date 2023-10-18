<template>
  <el-col :span="12">
    <el-card>
      <div slot="header">
        <span>Account Info</span>
      </div>

      <el-row>
        <p v-if="user.username">
          Username: <b>{{ user.username }}</b>
        </p>
        <p>
          Address: <b>{{ user.address }}</b>
        </p>

        <br v-if="user.lockHeight !== '0'"/>


        <p v-if="user.lockHeight !== '0'">
          Locked Balance: <b>{{ user.lockAmountPretty }} GNY</b>
        </p>
        <p v-if="user.lockHeight !== '0'">
          Available to unlock at Block Height: <b>{{ user.lockHeight }}</b>
        </p>
        <p v-if="user.lockHeight !== '0'">
          Unlocked Balance: <b>{{ user.balancePretty }} GNY</b>
        </p>

        <br v-if="user.lockHeight !== '0'"/>

        <p>
          Total Balance: <b> {{ user.totalBalancePretty }} GNY</b>
        </p>
        <p v-if="user.secondPublicKey">
          Has Second Secret:
          <b>{{ user.secondPublicKey === null ? 'No' : 'Yes' }}</b>
        </p>
        <p v-if="user.secondPublicKey">
          Second PublicKey: <b>{{ user.secondPublicKey }}</b>
        </p>
      </el-row>
    </el-card>
  </el-col>
</template>

<script>
export default {
  props: {
    user: Object,
  },
};
</script>
