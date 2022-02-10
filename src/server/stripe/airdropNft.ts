import { ethers } from 'ethers'
import { rpcAddresses } from '../../lib/rpc'

type AirdropProps = {
  airdropWallet: string;
  amount: number;
  contractToken: string;
  chainId: number | string
};

export async function airdropNft({
  airdropWallet,
  amount,
  contractToken,
  chainId
}: AirdropProps): Promise<boolean> {
  try {
    // const signer = ethers.Signer.
    const rpcAddress = rpcAddresses[Number(chainId)]
    if (!rpcAddress) {
      throw new Error(`RpcAddress not configured ${chainId}`)
    }
    const provider = new ethers.providers.JsonRpcProvider(rpcAddress)
    const signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY as string, provider)
    const contract: any = new ethers.Contract(
      contractToken,
      process.env.NEXT_PUBLIC_ABI as any,
      signer
    )

    console.log('airdrop attempt', contractToken, airdropWallet, amount)
    await contract.functions.mint(amount, airdropWallet, {
      value: 0
    })
    console.log('airdrop successful', contractToken, airdropWallet, amount)
    return true
  } catch (e: any) {
    console.log('error', contractToken, airdropWallet, amount)
    console.log(`ERROR_MESSAGE on contract: ${contractToken}. wallet: ${airdropWallet} amount: ${amount}`, e.message)
    return false
  }
}
