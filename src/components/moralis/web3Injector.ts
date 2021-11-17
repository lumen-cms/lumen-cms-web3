import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

let supportedChainIds = [1, 3, 4, 5, 42, 56, 97, 1337]
export const injected = new InjectedConnector({
  supportedChainIds
})
const RPC_URLS: { [chainId: number]: string } = {
  1: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213',
  4: 'https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213'
}
export const walletconnect = new WalletConnectConnector({
  supportedChainIds,
  rpc: { 1: RPC_URLS[process.env.NEXT_PUBLIC_MORALIS_CHAIN === 'rinkeby' ? 4 : 1] },
  qrcode: true
})
