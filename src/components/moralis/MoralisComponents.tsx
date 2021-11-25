import { LmCoreComponents } from '@CONFIG'
import dynamic from 'next/dynamic'
import Web3Provider from './Web3Provider'
import EthersProvider from './useEthers'

const MoralisContent = dynamic(() => import('./MoralisContent'), {
  ssr: false
})

LmCoreComponents.moralis = MoralisContent
// LmCoreComponents.lm_app_providers.push(LmMoralisProvider)
LmCoreComponents.lm_app_providers.push(Web3Provider)

// LmCoreComponents.lm_app_providers.push(EthersProvider)
