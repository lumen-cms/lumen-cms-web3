import { LmCoreComponents } from '@CONFIG'
import LmMoralisProvider from './MoralisProvider'
import MoralisContent from './MoralisContent'

LmCoreComponents.moralis = MoralisContent
LmCoreComponents.lm_app_providers.push(LmMoralisProvider)
