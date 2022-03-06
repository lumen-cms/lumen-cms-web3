import { ethers } from 'ethers'
import { rpcAddresses } from '../../lib/rpc'
import { JsonRpcProvider } from '@ethersproject/providers'
import fetch from 'node-fetch'

type AirdropProps = {
  airdropWallet: string;
  amount: number;
  contractToken: string;
  chainId: number | string
};

interface FeeDataEIP1559 {
  maxPriorityFee: number;
  maxFee: number;
}

export const getPolygon1559FeeData = async (): Promise<FeeDataEIP1559> => {
  try {
    const data = await fetch('https://gasstation-mainnet.matic.network/v2')
      .then(r => r.json())

    const feeData: FeeDataEIP1559 = data.standard
    return feeData
  } catch (error) {
    throw(error)
  }
}

class UpdatedJsonRpcProvider extends JsonRpcProvider {
  public async getFeeData(): Promise<ethers.providers.FeeData> {
    const feeData: FeeDataEIP1559 = await getPolygon1559FeeData()
    const data = {
      maxFeePerGas: ethers.BigNumber.from((feeData.maxFee * Math.pow(10, 9)).toFixed(0)),
      maxPriorityFeePerGas: ethers.BigNumber.from((feeData.maxPriorityFee * Math.pow(10, 9)).toFixed(0)),
      gasPrice: ethers.BigNumber.from((feeData.maxFee * Math.pow(10, 9)).toFixed(0))
    }
    return data
  }
}

export async function airdropNft({
  airdropWallet,
  amount,
  contractToken,
  chainId
}: AirdropProps): Promise<string | { error: string }> {
  try {
    // const signer = ethers.Signer.
    const rpcAddress = rpcAddresses[Number(chainId)]
    if (!rpcAddress) {
      throw new Error(`RpcAddress not configured ${chainId}`)
    }
    const provider = new UpdatedJsonRpcProvider(rpcAddress)

    const signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY as string, provider)
    console.log(signer.address)
    const contract = new ethers.Contract(
      contractToken,
      process.env.NEXT_PUBLIC_ABI as any,
      // signer
      signer
    )

    // const gas = await contract.()
    console.log(`airdrop attempt: Contract: ${contractToken}, Wallet: ${airdropWallet}, Amount: ${amount}, Signer Of Contract: ${signer.address}, RPC: ${rpcAddress}`)

    const mintTx = await contract.functions.mint(amount, airdropWallet, {
      value: 0
    })
    console.log('airdrop successful', contractToken, airdropWallet, amount)
    console.log('TX', mintTx.hash)
    return mintTx.hash
  } catch (e: any) {
    console.log('error', contractToken, airdropWallet, amount)
    console.log(`ERROR_MESSAGE on contract: ${contractToken}. wallet: ${airdropWallet} amount: ${amount}`, e.message)
    return { error: e.message }
  }
}
