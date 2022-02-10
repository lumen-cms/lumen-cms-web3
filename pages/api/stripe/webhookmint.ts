import { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'micro-cors'
import { verifyStripeWebhook } from '../../../src/server/stripe/verifyStripeWebhook'
import { Stripe } from 'stripe'
import { airdropNft } from '../../../src/server/stripe/airdropNft'
import { StripeRequestBodyProps } from '../../../src/lib/stripeConfig'
import { updatePaymentIntent } from '../../../src/server/stripe/createPaymentIntent'

export const config = {
  api: {
    bodyParser: false
  }
}
const cors = Cors({
  allowMethods: ['POST', 'HEAD']
})


const webhookApi = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const event = await verifyStripeWebhook(req, res)
    if (event?.type) {
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const paymentId = paymentIntent.id
        const metadata = paymentIntent.metadata as StripeRequestBodyProps
        if (paymentId && metadata.contractToken && metadata.nftAmount && metadata.walletToken && metadata.chainId && !metadata.airdropped) {
          const success = await airdropNft({
            airdropWallet: metadata.walletToken,
            contractToken: metadata.contractToken,
            amount: Number(metadata.nftAmount),
            chainId: metadata.chainId
          })
          if (success) {
            const newMetadata = {
              ...metadata,
              airdropped: new Date().toISOString()
            }
            await updatePaymentIntent(paymentId, newMetadata)
            res.status(200).json({ ...newMetadata })
            return
          }
        }

      }
      res.status(200).send('do nothing because no wallet metadata present')
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}


export default cors(webhookApi as any)
