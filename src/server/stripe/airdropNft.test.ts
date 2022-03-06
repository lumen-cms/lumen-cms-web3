import { airdropNft, getPolygon1559FeeData } from './airdropNft'

// walletToken
// 0x628077413209ae5e980401F4C774C33f652C27F1
// contractToken
// 0xb1863819AaAB88FBf0c6452510F72601F05a2c42
// nftAmount
// 1
// chainId
// 137
// airdropped
// 2022-03-02T09:41:56.607Z
describe('Airdrop NFT based on contract and amount', function() {
  test('try one contract airdrop', async () => {
    const success = await airdropNft({
      contractToken: '0xb1863819AaAB88FBf0c6452510F72601F05a2c42',
      amount: 1,
      airdropWallet: '0x628077413209ae5e980401F4C774C33f652C27F1',
      chainId: 137
    })
    expect(typeof success === 'string').toBeTruthy()
  })
  test('get polygon data', async () => {
    const d = await getPolygon1559FeeData()
    expect(typeof d.maxPriorityFee === 'number').toBeTruthy()
    expect(typeof d.maxFee === 'number').toBeTruthy()
  })
})
