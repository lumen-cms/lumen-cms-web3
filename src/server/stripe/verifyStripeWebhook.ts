import Stripe from 'stripe'
import { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2020-08-27'
})

export const verifyStripeWebhook = async (req: NextApiRequest, res: NextApiResponse): Promise<Stripe.Event | undefined> => {
  try {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']!
    const event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SK as string)
    return event
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    // On error, log and return the error message.
    if (err! instanceof Error) console.log(err)
    console.log(`❌ Error message: ${errorMessage}`)
    res.status(400).send(`Webhook Error: ${errorMessage}`)
  }
}
