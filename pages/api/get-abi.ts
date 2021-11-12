import { NextApiRequest, NextApiResponse } from 'next'
import { getContractAbi } from '../../src/lib/getContractAbi'

export default async function getAbi(req: NextApiRequest, res: NextApiResponse) {
  const abi = await getContractAbi()
  // some caching
  // console.log(abi)
  return res.json(abi)
}
