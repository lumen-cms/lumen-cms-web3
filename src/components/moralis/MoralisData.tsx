import { MoralisDataStoryblok } from '../../typings/__generated__/components-schema'
import { useWeb3React } from '@web3-react/core'
import { CHAINS } from './chainsConfig'
import useSWR from 'swr'
import { Web3Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { renderRichText } from 'lumen-cms-core/src/components/paragraph/renderRichText'

type MoralisDataProps = {
  content: MoralisDataStoryblok
}

const envAbi = process.env.NEXT_PUBLIC_ABI ? JSON.parse(process.env.NEXT_PUBLIC_ABI) : null


const valueParser = (val: any) => {
  const value = val?.[0]
  if (value?._isBigNumber) {
    const big = value.toBigInt()
    const number = Number(big)
    return number > 100000 ? ethers.utils.formatEther(value) : number
  }
  return val
}
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


export default function MoralisData({ content }: MoralisDataProps) {
  const { contract_token, richtext, chain, data_values } = content
  const { library, chainId } = useWeb3React<Web3Provider>()
  const selectedChain = CHAINS[chain || 'mainnet']
  const isCorrectChain = selectedChain?.id === chainId
  const {
    data,
    isValidating,
    mutate
  } = useSWR((library && richtext) ? [`/api/contract/${contract_token}`, chainId, data_values] : null, {
    fetcher: fetcher
  })

  if (!isCorrectChain) {
    return (
      <div className={'py-3'}>You are not in the correct Network. Please change
        to <strong><i>{selectedChain.displayName}</i></strong></div>
    )
  }
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
