import { AppPageProps } from 'lumen-cms-core/src/typings/app'
import { MoralisMintStoryblok } from '../typings/__generated__/components-schema'
import { MoralisMintData } from '../components/moralis/moralisTypings'
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'
import { SSR_CONFIG } from '@SSR_CONFIG'

export const getContractAbi = async (id: string) => {
  const ABI_URL: string = process.env.NEXT_PUBLIC_ABI_URI as string + id + '&apikey=' + process.env.ETHERSCAN_API_KEY
  const result = await fetch(ABI_URL)
  if (result.ok) {
    const values = await result.json()
    const x = values.result
    return typeof x === 'string' ? JSON.parse(x) : x
  } else {
    console.log(result)
    throw new Error('error while fetching abi')
  }
}

export const getMerkleRoot = () => {
  // @ts-ignore
  const addresses = SSR_CONFIG.web3Whitelist as string[] || []
  const leafNodes = addresses.map((address) => keccak256(address))
  const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
  const root = tree.getRoot().toString('hex')
  return root
}
export const getContractAbiPageProps = async (item: MoralisMintStoryblok, _props: AppPageProps): Promise<MoralisMintData> => {
  let id = item.contract_token
  if (id) {
    return {
      abi: await getContractAbi(id),
      merkleRoot: getMerkleRoot()
    }
  }
  return {
    abi: '',
    merkleRoot: ''
  }
}
