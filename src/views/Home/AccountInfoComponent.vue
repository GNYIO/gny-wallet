<template>
  <el-col :span="12">
    <el-card>
      <div slot="header">
        <span>Account Info</span>
      </div>

      <el-row>
        <el-col :span="12">
          <p v-if="user.username">
            Username: <b>{{ user.username }}</b>
          </p>
          <p>
            Address: <b>{{ user.address }}</b>
          </p>
          <p>
            Balance: <b>{{ user.balancePretty }} GNY</b>
          </p>
        </el-col>
        <el-col :span="12">
          <p>
            Is Locked: <b>{{ user.lockHeight === '0' ? 'No' : 'Yes' }}</b>
          </p>
          <p v-if="user.lockHeight !== '0'">
            Lock Height: <b>{{ user.lockHeight }}</b>
          </p>
          <p v-if="user.lockHeight !== '0'">
            Lock Amount: <b>{{ user.lockAmountPretty }} GNY</b>
          </p>
          <p v-if="user.secondPublicKey">
            Has Second Secret:
            <b>{{ user.secondPublicKey === null ? 'No' : 'Yes' }}</b>
          </p>
          <p v-if="user.secondPublicKey">
            Second PublicKey: <b>{{ user.secondPublicKey }}</b>
          </p>
        </el-col>
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
