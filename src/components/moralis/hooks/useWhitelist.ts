import { MoralisMintProps } from '../moralisTypings'
import useSWR from 'swr'
import { useWeb3React } from '@web3-react/core'
import { CHAINS } from '../chainsConfig'


export default function useWhitelist(content: MoralisMintProps['content']) {
  const { account, chainId, library, error } = useWeb3React()
  const selectedChain = CHAINS[content.chain || 'mainnet']
  const isCorrectChain = selectedChain?.id === chainId

  const {
    error: whitelistError,
    isValidating,
    data
  } = useSWR<{ signed: string, amount: number }>((content.sale === 'whitelist' && account && isCorrectChain) ? `/api/sign/${account}?chainId=${chainId}&contractAddress=${content.contract_token}` : null)

  return {
    account,
    chainId,
    library,
    isCorrectChain,
    selectedChain,
    signed: data?.signed,
    maxAmountWhitelist: data?.amount,
    isValidatingWhitelist: isValidating,
    error: error || whitelistError
  }
}
