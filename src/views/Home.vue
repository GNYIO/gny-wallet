<template>
  <div>
    <el-row :gutter="20">
      <AccountInfoComponent v-bind:user="user"></AccountInfoComponent>
      <SetUsernameComponent
        v-bind:user="user"
        v-bind:positiveBalance="positiveBalance"
        v-bind:passphrase="passphrase"
        v-bind:secondPassphrase="secondPassphrase"
      ></SetUsernameComponent>
    </el-row>

    <el-row :gutter="20">
      <Set2ndPasswordComponent
        v-bind:user="user"
        v-bind:positiveBalance="positiveBalance"
        v-bind:passphrase="passphrase"
        v-bind:hasSecondPassphrase="hasSecondPassphrase"
      ></Set2ndPasswordComponent>

      <LockAccountComponent
        v-bind:user="user"
        v-bind:positiveBalance="positiveBalance"
        v-bind:minLockHeight="minLockHeight"
        v-bind:passphrase="passphrase"
        v-bind:secondPassphrase="secondPassphrase"
      ></LockAccountComponent>

      <UnlockAccountComponent
        v-bind:user="user"
        v-bind:positiveBalance="positiveBalance"
        v-bind:latestBlock="latestBlock"
        v-bind:passphrase="passphrase"
        v-bind:secondPassphrase="secondPassphrase"
      ></UnlockAccountComponent>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <TransactionsPaged></TransactionsPaged>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import TransactionsPaged from './TransactionsPaged';
import AccountInfoComponent from './Home/AccountInfoComponent';
import SetUsernameComponent from './Home/SetUsernameComponent';
import Set2ndPasswordComponent from './Home/Set2ndPasswordComponent';
import LockAccountComponent from './Home/LockAccountComponent';
import UnlockAccountComponent from './Home/UnlockAccountComponent';

export default {
  components: {
    TransactionsPaged,
    AccountInfoComponent,
    SetUsernameComponent,
    Set2ndPasswordComponent,
    LockAccountComponent,
    UnlockAccountComponent,
  },
  data() {
    return {
      placeholder: '',
    };
  },
  computed: {
    ...mapState(['passphrase', 'secondPassphrase', 'latestBlock']),
    ...mapGetters([
      'user',
      'positiveBalance',
      'hasSecondPassphrase',
      'minLockHeight',
    ]),
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
  },
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 18px;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>
