export const getDefaultState = () => ({
  passphrase: null,
  secondPassphrase: null,
  user: {},
  delegate: null,
  isLoggedIn: false,
  token: '',
  latestBlock: {},
  myVoters: [],
  allDelegateNames: [],
  isIssuer: false,
  issuer: {},
  assets: [],
  transactions: [],
  whoIVotedFor: [],

  hasUsername: false,
  isLocked: false,

  transfers: [],
  balances: [],
});
