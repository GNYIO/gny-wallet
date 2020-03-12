

export const getters = {
  passphrase: state => state.passphrase,
  user: state => state.user,
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
      const one = {
        name: asset.name,
        precision: asset.precision,
        maximum: asset.maximum,
        maximumPretty: asset.maximum / prec,
        quantity: asset.quantity,
        quantityPretty: asset.quantity / prec,
        desc: asset.desc,
        issuerId: asset.issuerId,
      };
      return one;
    });
    return assets;
  },
  assetsCount: state => state.assets.length,
  ownAssets: state => state.assets.filter(x => x.issuerId === state.user.address),
};
