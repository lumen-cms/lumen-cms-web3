import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { rpcAddresses } from '../../lib/rpc'

const supportedChainIds = [1, 3, 4, 5, 42, 56, 97, 1337, 137, 80001]
export const injected = new InjectedConnector({
  supportedChainIds
})

export const walletconnect = new WalletConnectConnector({
  supportedChainIds,
  rpc: rpcAddresses,
  qrcode: true
})
