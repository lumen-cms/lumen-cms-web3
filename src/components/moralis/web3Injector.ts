import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const supportedChainIds = [1, 3, 4, 5, 42, 56, 97, 1337, 137, 80001]
export const injected = new InjectedConnector({
  supportedChainIds
})

/*
 https://polygon-rpc.com or
https://rpc-mainnet.matic.network or
https://rpc-mainnet.maticvigil.com or
https://rpc-mainnet.matic.quiknode.pro
 */
export const walletconnect = new WalletConnectConnector({
  supportedChainIds,
  rpc: {
    1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA}`,
    4: `https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA}`,
    137: 'https://polygon-rpc.com',
    80001: 'https://rpc-mumbai.matic.today'
  },
  qrcode: true
})
