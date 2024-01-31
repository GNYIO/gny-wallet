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
  setBurn(state, burn) {
    state.burn = burn;
  },
  setBalances(state, balances) {
    state.balances = balances;
  },
  setSupply(state, result) {
    state.supply = result.supply;
    state.burned = result.burned;
  },

  // web3
  setConnectedToMetaMask(state, connectedToMetaMask) {
    state.connectedToMetaMask = connectedToMetaMask;
  },
  setIsCorrectChainId(state, isCorrectChainId) {
    state.isCorrectChainId = isCorrectChainId;
  },
  setEthAddress(state, ethAddress) {
    state.ethAddress = ethAddress;
  },
  setAllowance(state, allowance) {
    state.allowance = allowance;
  },
  setMetaMaskBalance(state, metaMaskBalance) {
    state.metaMaskBalance = metaMaskBalance;
  },
  resetState(state) {
    const newState = getDefaultState();
    Object.assign(state, newState);
  },
};
