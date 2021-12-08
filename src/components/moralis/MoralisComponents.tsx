import { LmCoreComponents } from '@CONFIG'
import dynamic from 'next/dynamic'
import Web3Provider from './Web3Provider'
import MoralisMint from './MoralisMint'
import MoralisAuth from './MoralisAuth'

const MoralisContent = dynamic(() => import('./MoralisContent'), {
  ssr: false
})

LmCoreComponents.moralis = MoralisContent
LmCoreComponents.moralis_button = MoralisAuth
LmCoreComponents.moralis_mint = MoralisMint
// LmCoreComponents.lm_app_providers.push(LmMoralisProvider)
LmCoreComponents.lm_app_providers.push(Web3Provider)

// LmCoreComponents.lm_app_providers.push(EthersProvider)
