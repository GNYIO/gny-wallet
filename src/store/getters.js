

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
  transfersFromMe: state => state.transfers.filter(x => x.senderId === state.user.address),
  transfersToMe: state => state.transfers.filter(x => x.recipientId === state.user.address),
};
