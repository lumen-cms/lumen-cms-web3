import { MoralisMintProps } from './moralisTypings'

export const getPurchaseEventData = (content: MoralisMintProps['content'], {
  currentCost,
  amount
}: { amount: number, currentCost: string }) => {
  const value = content.price_in_usd || content.price_fiat || currentCost
  const eventPartial: Gtag.CustomParams | facebook.Pixel.CustomParameters = {
    value: Number(value) * amount,
    currency: 'USD'
  }
  const event: { google: Gtag.CustomParams, facebook: facebook.Pixel.CustomParameters } = {
    google: {
      ...eventPartial,
      event_category: 'Mint',
      items: [{
        id: content.contract_token,
        amount
      }]
    },
    facebook: {
      ...eventPartial,
      contents: [{
        id: content.contract_token,
        amount
      }]
    }
  }
  return event
}
