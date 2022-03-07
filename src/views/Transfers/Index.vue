<template>
  <div>
    <TransferComponent
      v-bind:user="user"
      v-bind:passphrase="passphrase"
      v-bind:secondPassphrase="secondPassphrase"
      v-bind:positiveBalance="positiveBalance"
    ></TransferComponent>
    <TransfersPagedComponent></TransfersPagedComponent>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import TransferComponent from './TransferComponent.vue';
import TransfersPagedComponent from './TransfersPagedComponent';

export default {
  components: {
    TransferComponent,
    TransfersPagedComponent,
  },
  computed: {
    ...mapState(['user', 'passphrase', 'secondPassphrase']),
    ...mapGetters(['positiveBalance', 'width']),
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
  },
};
</script>
