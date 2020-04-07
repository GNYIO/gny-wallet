import { BigNumber } from 'bignumber.js';

export const getters = {
  passphrase: state => state.passphrase,
  user: state => ({
    address: state.user.address ? state.user.address : undefined,
    balance: state.user.balance ? state.user.balance : undefined,
    balancePretty: state.user.balance
      ? new BigNumber(state.user.balance).dividedBy(1e8).toFixed()
      : undefined,
    secondPublicKey: state.user.secondPublicKey
      ? state.user.secondPublicKey
      : null,
    lockHeight: state.user.lockHeight ? state.user.lockHeight : String(0),
    lockAmount: state.user.lockAmount ? state.user.lockAmount : String(0),
    lockAmountPretty: state.user.lockAmount
      ? new BigNumber(state.user.lockAmount).dividedBy(1e8).toFixed()
      : String(0),
    isDelegate: state.user.isDelegate ? state.user.isDelegate : 0,
    username: state.user.username ? state.user.username : null,
    publicKey: state.user.publicKey ? state.user.publicKey : null,
  }),
  hasSecondPassphrase: state => !!state.user.secondPublicKey,
  secondPublicKey: state => state.user.secondPublicKey,
  isLoggedIn: state => state.isLoggedIn,
  latestBlock: state => state.latestBlock,
  prettyDelegates: state => {
    const delegates = state.allDelegateNames.map(delegate => ({
      address: delegate.address,
      username: delegate.username,
      producedBlocks: delegate.producedBlocks,
      rate: delegate.rate,
      rewards: new BigNumber(delegate.rewards).dividedBy(1e8).toFixed(),
      productivity: delegate.productivity + '%',
      approval: delegate.approval,
    }));
    return delegates;
  },
  delegatesCount: state => state.allDelegateNames.length,
  delegatesForWhichIHaveNotVotedYet: state => {
    const alreadyVotedFor = state.whoIVotedFor.map(x => x.username);

    const delegates = state.allDelegateNames.filter(
      x => !alreadyVotedFor.includes(x.username),
    );

    return delegates;
  },
  transactionsNewestFirst: state => {
    const copy = [];
    copy.push(...state.transactions);
    return copy.reverse();
  },
  transactionsCount: state => state.transactions.length,

  transfersPretty: state => {
    const transfers = state.transfers.map(transfer => ({
      tid: transfer.tid,
      senderId: transfer.senderId,
      recipientId: transfer.recipientId,
      recipientName: transfer.recipientName,
      currency: transfer.currency,
      amount: new BigNumber(transfer.amount).dividedBy(1e8).toFixed(),
      timestamp: transfer.timestamp,
      height: transfer.height,
    }));
    return transfers;
  },
  transfersCount: state => state.transfers.length,

  gnyTransfersPretty: (state, getters) =>
    getters.transfersPretty.filter(x => x.currency === 'GNY'),
  gnyTransfersPrettyCount: (state, getters) =>
    getters.gnyTransfersPretty.length,

  assetTransfersPretty: (state, getters) =>
    getters.transfersPretty.filter(x => x.currency !== 'GNY'),
  assetTransfersPrettyCount: (state, getters) =>
    getters.assetTransfersPretty.length,

  prettyAssets: state => {
    const assets = state.assets.map(asset => {
      const prec = Math.pow(10, asset.precision);
      const difference = new BigNumber(asset.maximum)
        .minus(asset.quantity)
        .toFixed();

      const one = {
        name: asset.name,
        precision: asset.precision,
        maximum: asset.maximum,
        maximumPretty: new BigNumber(asset.maximum).dividedBy(prec).toFixed(),
        quantity: asset.quantity,
        quantityPretty: new BigNumber(asset.quantity).dividedBy(prec).toFixed(),
        leftToIssue: difference,
        leftToIssuePretty: new BigNumber(difference).dividedBy(prec).toFixed(),
        desc: asset.desc,
        issuerId: asset.issuerId,
      };
      return one;
    });
    return assets;
  },
  assetsCount: state => state.assets.length,
  ownAssets: (state, getters) =>
    getters.prettyAssets.filter(x => x.issuerId === state.user.address),

  prettyBalances: (state, getters) => {
    const balances = state.balances.map(balance => {
      const asset = getters.prettyAssets.filter(
        x => x.name === balance.currency,
      )[0];
      const precision = Math.pow(10, asset.precision);

      const one = {
        address: balance.address,
        currency: balance.currency,
        flat: balance.flag,
        balance: balance.balance,
        balancePretty: new BigNumber(balance.balance)
          .dividedBy(precision)
          .toFixed(),
      };
      return one;
    });
    return balances;
  },
  positiveBalance: state => new BigNumber(state.user.balance).isGreaterThan(0),
  minLockHeight: (state, getters) =>
    new BigNumber(getters.latestBlock.height)
      .plus(172800)
      .plus(10)
      .toFixed(),
};
