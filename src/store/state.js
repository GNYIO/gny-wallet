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
  burn: [],
  balances: [],

  burned: String(0),
  supply: String(0),


  connectedToMetaMask: false,
  ethAddress: '',
  allowance: 0,
  metaMaskBalance: 0,

});
