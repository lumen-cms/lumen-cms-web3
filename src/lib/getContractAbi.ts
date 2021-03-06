import { AppPageProps } from 'lumen-cms-core/src/typings/app'
import { MoralisMintStoryblok } from '../typings/__generated__/components-schema'
import { MoralisMintData } from '../components/moralis/moralisTypings'

export const getContractAbi = async (id: string) => {
  const ABI_URL: string = process.env.NEXT_PUBLIC_ABI_URI as string + id + '&apikey=' + process.env.ETHERSCAN_API_KEY
  const result = await fetch(ABI_URL)
  if (result.ok) {
    const values = await result.json()
    const x = values.result
    let resultOfFetch = typeof x === 'string' ? JSON.parse(x) : x
    return resultOfFetch
  } else {
    console.log(result)
    throw new Error('error while fetching abi')
  }
}

export const getContractAbiPageProps = async (item: MoralisMintStoryblok, _props: AppPageProps): Promise<MoralisMintData> => {
  let id = item.contract_token
  // ignore contract fetch if ENV var exists
  if (id && !process.env.NEXT_PUBLIC_ABI) {
    return {
      abi: await getContractAbi(id)
    }
  }
  return {
    abi: ''
  }
}
