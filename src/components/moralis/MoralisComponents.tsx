import { LmCoreComponents } from '@CONFIG'
import LmMoralisProvider from './MoralisProvider'
import dynamic from 'next/dynamic'

const MoralisContent = dynamic(() => import('./MoralisContent'), {
  ssr: false
})

LmCoreComponents.moralis = MoralisContent
LmCoreComponents.lm_app_providers.push(LmMoralisProvider)
