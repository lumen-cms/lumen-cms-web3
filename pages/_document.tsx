import { SSR_CONFIG } from '@SSR_CONFIG'
import { MoralisMintStoryblok } from '../src/typings/__generated__/components-schema'

export { LmDefaultDocument as default } from 'lumen-cms-core/src/server'

SSR_CONFIG.ssrHooks.componentData.moralis_mint = async (item: MoralisMintStoryblok, props) => {
  console.log('inside server', item)
  return []
}
