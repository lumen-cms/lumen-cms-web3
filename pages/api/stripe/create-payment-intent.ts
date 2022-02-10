import { NextApiRequest, NextApiResponse } from 'next'
import { StripeRequestBodyProps } from '../../../src/lib/stripeConfig'
import { createPaymentIntent } from '../../../src/server/stripe/createPaymentIntent'


export default async function createPaymentIntentApi(req: NextApiRequest, res: NextApiResponse) {
  const props: StripeRequestBodyProps = req.method === 'POST' ? req.body : req.query
  try {
    const paymentIntent = await createPaymentIntent(props)
    res.status(200).json(paymentIntent)
  } catch (err: any) {
    console.log(err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}
