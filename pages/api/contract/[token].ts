import { NextApiRequest, NextApiResponse } from 'next'
import { getContractData } from '../../../src/lib/getContractData'

export default async function getAbi(req: NextApiRequest, res: NextApiResponse) {
  const { token, chain, functions, userToken } = req.query
  if (token) {
    const result = await getContractData({
      token: token as string, chain: chain as string, functions: functions as string, userToken: userToken as string
    })
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
    res.json(result)
  } else {
    res.status(404).send('not found')
  }
}
