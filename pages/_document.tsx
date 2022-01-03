import { SSR_CONFIG } from '@SSR_CONFIG'
import { getContractAbiPageProps } from '../src/lib/getContractAbi'

export { LmDefaultDocument as default } from 'lumen-cms-core/src/server'
SSR_CONFIG.ssrHooks.componentData.moralis_mint = getContractAbiPageProps
