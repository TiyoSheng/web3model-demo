import WalletConnectProvider from '@walletconnect/web3-provider';
import Torus from '@toruslabs/torus-embed';
import Authereum from 'authereum';

import { Bitski } from 'bitski';

import Fortmatic from 'fortmatic';
// eslint-disable-next-line global-require
//
const providerOptions = {
  // https://docs.walletconnect.org/
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: 'd10c4ff706c546c485a8d9d92d1e5096', // TODO infuraId
    },
  },
  bitkeep: {
    package: WalletConnectProvider,
    options: {
      infuraId: 'd10c4ff706c546c485a8d9d92d1e5096', // TODO infuraId
    },
  }
};

export { providerOptions };
