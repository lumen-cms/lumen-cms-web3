export const getContractAbi = async (url: string) => {
  const result = await fetch(url)
  if (result.ok) {
    const values = await result.json()
    return values.result?.[0].ABI
  } else {
    return null
  }
}
