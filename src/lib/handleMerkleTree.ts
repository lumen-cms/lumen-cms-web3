import keccak256 from 'keccak256'
import { MerkleTree } from 'merkletreejs'
import { NextApiRequest, NextApiResponse } from 'next'

const getMerkleRootProof = (address: string, addresses: string[]) => {
  const leafNodes = addresses.map((address) => keccak256(address))
  const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
  return {
    root: tree.getHexRoot(),
    proof: tree.getHexProof(keccak256(address))
  }
}

export default async function handleMerkleTree(req: NextApiRequest, res: NextApiResponse, whitelist: string[]) {
  const { address } = req.query
  if (typeof address === 'string') {
    const { root, proof } = getMerkleRootProof(address, whitelist)
    let isWhitelisted = proof.length > 0
    console.log(root, proof)
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=59'
    )
    res.json({
      isWhitelisted,
      proof: isWhitelisted ? proof : ''
    })
  } else {
    res.json({
      isWhitelisted: false,
      proof: ''
    })
  }
}
