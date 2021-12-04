import { AppPageProps } from 'lumen-cms-core/src/typings/app'
import { MoralisMintStoryblok } from '../typings/__generated__/components-schema'

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
export const getContractAbiPageProps = async (item: MoralisMintStoryblok, _props: AppPageProps) => {
  let id = item.contract_token
  if (id) {
    return await getContractAbi(id)
  }
  return null
}
