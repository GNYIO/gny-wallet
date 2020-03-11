const mapping = {
  0: 'basic.transfer',
  1: 'basic.setUserName',
  2: 'basic.setSecondPassphrase',
  3: 'basic.lock',
  4: 'basic.vote',
  5: 'basic.unvote',
  6: 'basic.unlock',
  10: 'basic.registerDelegate',
  100: 'uia.registerIssuer',
  101: 'uia.registerAsset',
  102: 'uia.issue',
  103: 'uia.transfer',
  201: 'ml.uploadData',
  202: 'ml.getPrediction',
  203: 'ml.getPredictionCategory',
  204: 'ml.getPredictionTime',
  205: 'ml.getPredictionLocation',
  206: 'ml.filterOutliers',
  207: 'ml.fraudDetection',
  208: 'ml.locationPrediction',
  209: 'ml.nlp',
}

export function contractMappingFilter(contractNumber) {
  if (mapping[contractNumber]) {
    return mapping[contractNumber];
  }

  return 'unknown contract';
}

export function prettyPrintMyAddressFilter(address, myAddress) {
  if (address === myAddress) {
    return 'Me';
  }

  return address;
}
