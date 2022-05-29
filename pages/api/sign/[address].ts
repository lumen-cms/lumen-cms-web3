import { NextApiRequest, NextApiResponse } from 'next'
import signAddress from '../../../src/lib/signMessage'

const data = [{
  HolderAddress: 'some',
  Quantity: 2
}]

export default async function signAddressApi(req: NextApiRequest, res: NextApiResponse) {
  return signAddress(req, res, data)
}
