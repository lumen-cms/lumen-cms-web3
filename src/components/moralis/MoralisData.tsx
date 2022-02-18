import { MoralisDataStoryblok } from '../../typings/__generated__/components-schema'
import { CHAINS } from './chainsConfig'
import useSWR from 'swr'
import { renderRichText } from 'lumen-cms-core/src/components/paragraph/renderRichText'
import web3DataFetcher from './web3DataFetcher'


type MoralisDataProps = {
  content: MoralisDataStoryblok
}

export default function MoralisData({ content }: MoralisDataProps) {
  const { contract_token, richtext, chain, data_values } = content
  const selectedChain = CHAINS[chain || 'mainnet'] || 1
  const {
    data
  } = useSWR((richtext) ? [`/api/contract/${contract_token}`, selectedChain.id, data_values] : null, {
    fetcher: web3DataFetcher
  })

  if (!richtext) {
    return null
  }
  let stringify = JSON.stringify(richtext)
  const functionNames = (data_values || '').split(',').map(i => i.trim())
  functionNames.forEach((key, iteration) => {
    if (data) {
      stringify = stringify.replaceAll(`{${key}}`, data?.[iteration])
    } else {
      stringify = stringify.replaceAll(`{${key}}`, '')
    }
  })
  return (
    <div className={'lm-moralis__data'}>
      {renderRichText(JSON.parse(stringify))}
    </div>
  )
}
