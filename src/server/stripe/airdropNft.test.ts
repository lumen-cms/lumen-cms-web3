import { airdropNft } from './airdropNft'

describe('Airdrop NFT based on contract and amount', function() {
  test('try one contract airdrop', async () => {
    const success = await airdropNft({
      contractToken: '0x3628f363e0FD6d6EfaE325617C67D0B53355978B',
      amount: 1,
      airdropWallet: '0x829713B1c693268B28dC65b4201D346D3b84Cb60',
      chainId: 80001
    })
    expect(success).toBeTruthy()
  })
})
