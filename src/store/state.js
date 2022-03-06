export const getDefaultState = () => ({
  passphrase: null,
  secondPassphrase: null,
  user: {},
  delegate: {},
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
  isMenuToggled: false,
});
