import { NextApiRequest, NextApiResponse } from 'next'
import handleMerkleTree from '../../../src/lib/handleMerkleTree'

const web3Whitelist = ['0xdb70A49CDefae7F57F5CD06a8F1EaE251F91b442', '0xsdfsA49CDefae7F57F5CD06a8F1EaE251F91b442', '0xsdfsA49CDefae7F57F5CD06a8F1EaE251F911242', '0xsdfsA49CDefae7F57F5CD06a8F1EaE251F911111', '0x111A49CDefae7F57F5CD06a8F1EaE251F911111', '0x3fcc8348aAb5F30712CD92990fd661560fF4A21E', '0x3684154C46c793164165B5B615453201dbe12987']

export default async function address(req: NextApiRequest, res: NextApiResponse) {
  await handleMerkleTree(req, res, web3Whitelist)
}
