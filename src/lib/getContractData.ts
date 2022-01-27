import { ethers } from 'ethers'
import { rpcAddresses } from './rpc'


const envAbi = process.env.NEXT_PUBLIC_ABI ? JSON.parse(process.env.NEXT_PUBLIC_ABI) : null
type GetContractDataProps = {
  token: string
  chain?: string | number
  functions?: string
}
const valueParser = (val: any) => {
  const value = val?.[0]
  if (value?._isBigNumber) {
    const big = value.toBigInt()
    const number = Number(big)
    return number > 100000 ? ethers.utils.formatEther(value) : number
  }
  return val
}

export const getContractData = async ({
  token, chain, functions
}: GetContractDataProps) => {
  const functionNames = (functions || '').split(',').map(i => i.trim())
  if (!functionNames.length) {
    return null
  }
  const customHttpProvider = new ethers.providers.JsonRpcProvider(rpcAddresses[Number(chain || 80001)])
  const contract = new ethers.Contract(token, envAbi, customHttpProvider)

  const data = await Promise.all(functionNames.map(async func => {
    try {
      if (typeof contract.functions[func] === 'function') {
        const functionValue = await contract.functions[func]()
        return valueParser(functionValue)
      } else {
        console.log('not a function')
      }
    } catch (e) {
      console.error(func, e)
      return ''
    }
  }))
  return data
}
