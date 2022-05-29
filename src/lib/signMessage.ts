import { NextApiRequest, NextApiResponse } from 'next'
import { ethers, Wallet } from 'ethers'

const privKey = process.env.SIGNER_PRIVATE_KEY as string // DeeJay
export const meikoPublikKey = '0x1132dB08b02D0Ac9109D82C1BA8b4Da3A8D2abFe'

const getSignature = (): Wallet => {
  return new ethers.Wallet(privKey)
}

const createSignedMessage = ({
  contractAddress,
  minterAddress,
  chainId,
  amount
}: {
  chainId: number;
  contractAddress: string;
  minterAddress: string;
  amount: number;
}) => {
  const domain = {
    name: 'WhitelistToken',
    version: '1',
    chainId,
    verifyingContract: contractAddress
  }

  const types = {
    Minter: [
      { name: 'wallet', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ]
  }

  const signature = getSignature()
  console.log(
    'some more values',
    JSON.stringify(domain),
    minterAddress,
    amount
  )
  return signature._signTypedData(domain, types, {
    wallet: minterAddress,
    amount
  })
}

type WhitelistDataSource = { Quantity: number, HolderAddress: string }[]
export default async function signAddress(req: NextApiRequest, res: NextApiResponse, maikoWhitelistData: WhitelistDataSource) {
  const { address, chainId, contractAddress } = req.query
  let amount = maikoWhitelistData.find(i => i.HolderAddress === address)?.Quantity
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  if (!(amount && address && chainId && contractAddress)) {
    return { signed: false }
  }
  const signed = await createSignedMessage({
    minterAddress: address as string,
    chainId: Number(chainId) as number,
    contractAddress: contractAddress as string,
    amount: amount
  })
  return { signed, amount }
}
