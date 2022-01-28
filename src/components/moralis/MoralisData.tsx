import { MoralisDataStoryblok } from '../../typings/__generated__/components-schema'
import { useWeb3React } from '@web3-react/core'
import { CHAINS } from './chainsConfig'
import useSWR from 'swr'
import { Web3Provider } from '@ethersproject/providers'
import { renderRichText } from 'lumen-cms-core/src/components/paragraph/renderRichText'


const fetcher = async (...args: string[]) => {
  const [path, chain, functions] = args
  const functionNames = (functions || '').split(',').map(i => i.trim())
  if (!functionNames.length) {
    return null
  }
  const params = new URLSearchParams()
  params.append('chain', chain)
  params.append('functions', functionNames.join(','))
  const currentPathToApi = path + '?' + params.toString()
  return fetch(currentPathToApi).then(r => r.json())
}

type MoralisDataProps = {
  content: MoralisDataStoryblok
}

export default function MoralisData({ content }: MoralisDataProps) {
  const { contract_token, richtext, chain, data_values } = content
  const { chainId } = useWeb3React<Web3Provider>()
  const selectedChain = CHAINS[chain || 'mainnet'] || 1
  const isCorrectChain = selectedChain.id === chainId
  const {
    data
  } = useSWR((richtext) ? [`/api/contract/${contract_token}`, selectedChain.id, data_values] : null, {
    fetcher: fetcher
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
