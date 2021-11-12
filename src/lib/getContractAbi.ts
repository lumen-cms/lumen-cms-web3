const ABI_URL: string = process.env.NEXT_PUBLIC_ABI_URI as string + process.env.NEXT_PUBLIC_MORALIS_CONTRACT_ADDRESS as string + '&apikey=' + process.env.ETHERSCAN_API_KEY

export const getContractAbi = async () => {
  console.log(ABI_URL)
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
