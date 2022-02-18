import { MoralisAuthContainerStoryblok } from '../../typings/__generated__/components-schema'
import { useWeb3React } from '@web3-react/core'
import { LmComponentRender } from '@LmComponentRender'
import { CHAINS } from './chainsConfig'
import useSWR from 'swr'
import web3DataFetcher from './web3DataFetcher'

type MoralisAuthContainerProps = {
  content: MoralisAuthContainerStoryblok
}
export default function MoralisAuthContainer({ content }: MoralisAuthContainerProps) {
  const {
    chain,
    contract_token,
    fallback_message,
    body,
    not_connected_message,
    required_nft,
    show_only_not_logged_in
  } = content
  const { account, chainId } = useWeb3React()
  const selectedChain = CHAINS[chain || 'mainnet']
  const isCorrectChain = selectedChain?.id === chainId
  const data_values = 'balanceOf'
  const {
    data, isValidating
  } = useSWR((contract_token) ? [`/api/contract/${contract_token}`, selectedChain.id, data_values, account] : null, {
    fetcher: web3DataFetcher
  })
  if (isValidating || (show_only_not_logged_in && account)) {
    return null
  }
  if (show_only_not_logged_in && !account) {
    return (
      <>
        {body?.map(block => <LmComponentRender key={block._uid} content={block} />)}
      </>
    )
  }
  if (!account) {
    return (
      <>
        {not_connected_message?.map(block => <LmComponentRender key={block._uid} content={block} />)}
      </>
    )
  }
  if (!isCorrectChain) {
    return (
      <div className={'py-3'}>You are not in the correct Network. Please change
        to <strong><i>{selectedChain.displayName}</i></strong></div>
    )
  }
  const balanceOfUser = data?.[0] || 0
  const requiredNfts = required_nft ? Number(required_nft) : 0
  return requiredNfts <= balanceOfUser ? (
    <>
      {body?.map(block => <LmComponentRender key={block._uid} content={block} />)}
    </>
  ) : (
    <>
      {fallback_message?.map(block => <LmComponentRender key={block._uid} content={block} />)}
    </>
  )
}
