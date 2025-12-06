import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  // eslint-disable-next-line no-console
  console.warn('STRIPE_SECRET_KEY is not set. Stripe checkout will not work until this is configured.')
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover',
    })
  : null

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured on the server.' },
        { status: 500 }
      )
    }

    const body = await req.json().catch(() => ({}))

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud',
            unit_amount: 9900, // $99 AUD
            product_data: {
              name: 'RUN MVMT — Premium Training System',
              description: '12-week personalised plan + strength, nutrition, recovery & race strategy.',
            },
          },
          quantity: 1,
        },
      ],
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/performance-setup?checkout=success`,
      metadata: {
        source: 'runmvmt-quiz',
      },
      customer_creation: 'if_required',
      billing_address_collection: 'auto',
    })

    return NextResponse.json({ 
      clientSecret: session.client_secret,
      sessionId: session.id 
    })
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error creating Stripe Checkout Session:', error)
    return NextResponse.json(
      { error: 'Unable to create checkout session' },
      { status: 500 }
    )
  }
}



