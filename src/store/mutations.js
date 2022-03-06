import { getDefaultState } from './state';

export const mutations = {
  setLogin(state, loggedIn) {
    state.isLoggedIn = loggedIn;
  },
  setUser(state, user) {
    state.user = user;
  },
  setLatestBlock(state, block) {
    state.latestBlock = block;
  },
  setDelegateInfo(state, delegate) {
    state.delegate = delegate;
  },
  setMyVoters(state, myVoters) {
    state.myVoters = myVoters;
  },
  setPassphrase(state, passphrase) {
    state.passphrase = passphrase;
  },
  setSecondPassphrase(state, secondPassphrase) {
    state.secondPassphrase = secondPassphrase;
  },
  setAllDelegateNames(state, allDelegateNames) {
    state.allDelegateNames = allDelegateNames;
  },
  setIsIssuer(state, isIssuer) {
    state.isIssuer = isIssuer;
  },
  setIssuer(state, issuer) {
    state.issuer = issuer;
  },
  setAssets(state, assets) {
    state.assets = assets;
  },
  setTransactions(state, transactions) {
    state.transactions = transactions;
  },
  setOwnVotes(state, whoIVotedFor) {
    state.whoIVotedFor = whoIVotedFor;
  },
  setTransfers(state, transfers) {
    state.transfers = transfers;
  },
  setBalances(state, balances) {
    state.balances = balances;
  },
  resetState(state) {
    const newState = getDefaultState();
    Object.assign(state, newState);
  },
  toggleMenu(state) {
    state.isMenuToggled = !state.isMenuToggled;
  },
};
