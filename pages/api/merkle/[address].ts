import { NextApiRequest, NextApiResponse } from 'next'
import keccak256 from 'keccak256'
import { MerkleTree } from 'merkletreejs'

const web3Whitelist = ['0xdb70A49CDefae7F57F5CD06a8F1EaE251F91b442', '0xsdfsA49CDefae7F57F5CD06a8F1EaE251F91b442', '0xsdfsA49CDefae7F57F5CD06a8F1EaE251F911242', '0xsdfsA49CDefae7F57F5CD06a8F1EaE251F911111', '0x111A49CDefae7F57F5CD06a8F1EaE251F911111', '0x3fcc8348aAb5F30712CD92990fd661560fF4A21E', '0x3684154C46c793164165B5B615453201dbe12987']

const getMerkleRootProof = (address: string) => {
  const addresses = web3Whitelist as string[] || []
  const leafNodes = addresses.map((address) => keccak256(address))
  const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
  return {
    root: tree.getHexRoot(),
    proof: tree.getHexProof(keccak256(address))
  }
}

const getDummyProof = () => {
  const leaf = keccak256('0x00')
  // const hexProof = tree.getHexProof(leaf);
  return [leaf]
}

export default async function address(req: NextApiRequest, res: NextApiResponse) {
  const address = req.query.address
  if (typeof address === 'string') {
    const { root, proof } = getMerkleRootProof(address)
    let isWhitelisted = proof.length > 0
    console.log(root, proof)
    res.json({
      isWhitelisted,
      proof: isWhitelisted ? proof : getDummyProof()
    })
  } else {
    res.json({
      isWhitelisted: false,
      proof: getDummyProof()
    })
  }
}
