import { BigNumber } from 'bignumber.js';

export const getters = {
  passphrase: state => state.passphrase,
  user: state => state.user,
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
      rewards: Number(delegate.rewards) / 1e8,
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
      amount: Number(transfer.amount) / 1e8,
      timestamp: transfer.timestamp,
      height: transfer.height,
    }));
    return transfers;
  },
  transfersCount: state => state.transfers.length,
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
        maximumPretty: asset.maximum / prec,
        quantity: asset.quantity,
        quantityPretty: asset.quantity / prec,
        leftToIssue: difference,
        leftToIssuePretty: difference / prec,
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
        balancePretty: balance.balance / precision,
      };
      return one;
    });
    return balances;
  },
  positiveBalance: state => new BigNumber(state.user.balance).isGreaterThan(0),
};
