import { LmCoreComponents } from '@CONFIG'
import dynamic from 'next/dynamic'
import Web3Provider from './Web3Provider'

LmCoreComponents.moralis = dynamic(() => import(/* webpackChunkName: 'web3' */'./MoralisContent'), {
  ssr: false
})
LmCoreComponents.moralis_button = dynamic(() => import(/* webpackChunkName: 'web3' */'./MoralisAuth'), {
  ssr: false
})
LmCoreComponents.moralis_mint = dynamic(() => import(/* webpackChunkName: 'web3' */'./MoralisMint'), {
  ssr: false
})
LmCoreComponents.moralis_data = dynamic(() => import(/* webpackChunkName: 'web3' */'./MoralisData'), {
  ssr: false
})
LmCoreComponents.moralis_auth_container = dynamic(() => import(/* webpackChunkName: 'web3' */'./MoralisAuthContainer'), {
  ssr: false
})
// LmCoreComponents.lm_app_providers.push(LmMoralisProvider)
LmCoreComponents.lm_app_providers.push(Web3Provider)

// LmCoreComponents.lm_app_providers.push(EthersProvider)
