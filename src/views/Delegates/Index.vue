<template>
  <div>
    <el-row :gutter="20">
      <DelegateInfoComponent
        v-bind:user="user"
        v-bind:delegate="delegate"
      ></DelegateInfoComponent>

      <RegisterDelegateComponent
        v-bind:user="user"
        v-bind:passphrase="passphrase"
        v-bind:secondPassphrase="secondPassphrase"
      ></RegisterDelegateComponent>
    </el-row>

    <el-row :gutter="20">
      <WhoVotedForMeComponent
        v-bind:myVoters="myVoters"
      ></WhoVotedForMeComponent>

      <WhoIVotedForComponent
        v-bind:whoIVotedFor="whoIVotedFor"
      ></WhoIVotedForComponent>
    </el-row>

    <el-row :gutter="20">
      <VoteForDelegatesComponent
        v-bind:user="user"
        v-bind:passphrase="passphrase"
        v-bind:secondPassphrase="secondPassphrase"
        v-bind:delegatesForWhichIHaveNotVotedYet="
          delegatesForWhichIHaveNotVotedYet
        "
      ></VoteForDelegatesComponent>

      <UnvoteDelegatesComponent
        v-bind:whoIVotedFor="whoIVotedFor"
        v-bind:user="user"
        v-bind:passphrase="passphrase"
        v-bind:secondPassphrase="secondPassphrase"
      ></UnvoteDelegatesComponent>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover">
          <DelegatesPagedComponent></DelegatesPagedComponent>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DelegateInfoComponent from './DelegateInfoComponent';
import RegisterDelegateComponent from './RegisterDelegateComponent';
import WhoVotedForMeComponent from './WhoVotedForMeComponent';
import WhoIVotedForComponent from './WhoIVotedForComponent';
import VoteForDelegatesComponent from './VoteForDelegatesComponent';
import UnvoteDelegatesComponent from './UnvoteDelegatesComponent';
import DelegatesPagedComponent from './DelegatesPagedComponent';

import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    DelegateInfoComponent,
    RegisterDelegateComponent,
    WhoVotedForMeComponent,
    WhoIVotedForComponent,
    VoteForDelegatesComponent,
    UnvoteDelegatesComponent,
    DelegatesPagedComponent,
  },
  computed: {
    ...mapState([
      'passphrase',
      'secondPassphrase',
      'delegate',
      'myVoters',
      'whoIVotedFor',
    ]),
    ...mapGetters([
      'user',
      'prettyDelegates',
      'delegatesForWhichIHaveNotVotedYet',
    ]),
  },

  async mounted() {
    await this.$store.dispatch('refreshAccounts');
    await this.$store.dispatch('getWhoIVotedFor');

    await this.$store.dispatch('getMyVoters');
    await this.$store.dispatch('refreshDelegateInfo');
  },
};
</script>

<style scoped>
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
