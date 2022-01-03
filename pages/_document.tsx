import { SSR_CONFIG } from '@SSR_CONFIG'
import { getContractAbiPageProps } from '../src/lib/getContractAbi'

export { LmDefaultDocument as default } from 'lumen-cms-core/src/server'
SSR_CONFIG.ssrHooks.componentData.moralis_mint = getContractAbiPageProps
// @ts-ignore
SSR_CONFIG.web3Whitelist = ['0xdb70A49CDefae7F57F5CD06a8F1EaE251F91b442']
