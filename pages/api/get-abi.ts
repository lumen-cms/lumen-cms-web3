import { NextApiRequest, NextApiResponse } from 'next'
import { getContractAbi } from '../../src/lib/getContractAbi'

export default async function getAbi(_req: NextApiRequest, res: NextApiResponse) {
  const abi = await getContractAbi()
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
  return res.json(abi)
}
