import { NextApiRequest, NextApiResponse } from 'next'
import { getContractAbi } from '../../src/lib/getContractAbi'

export default async function getAbi(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id
  if (typeof id !== 'string') {
    return res.status(404).send('contract ID missing')
  }
  const abi = await getContractAbi(id)
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
  return res.json(abi)
}
