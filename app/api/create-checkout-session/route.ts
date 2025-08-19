import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { priceId, planId, interval } = await request.json()

    // Validate the request
    if (!priceId || !planId || !interval) {
      return NextResponse.json(
        { error: 'Missing required fields: priceId, planId, interval' },
        { status: 400 }
      )
    }

    // Validate price ID format
    if (!priceId.startsWith('price_')) {
      return NextResponse.json(
        { error: 'Invalid price ID format' },
        { status: 400 }
      )
    }

    // Get user email from Clerk (you'll need to implement this)
    // For now, we'll use a placeholder
    const userEmail = `user-${userId}@example.com` // TODO: Get actual email from Clerk

    // Check if customer already exists
    let customerId: string | undefined
    
    try {
      const existingCustomers = await stripe.customers.list({
        email: userEmail,
        limit: 1,
      })
      
      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id
      }
    } catch (error) {
      console.error('Error checking existing customers:', error)
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId,
        planId,
        interval,
      },
      customer: customerId, // Use existing customer if found
      ...(customerId && {
        customer_update: {
          address: 'auto',
          name: 'auto',
        },
      }),
      subscription_data: {
        metadata: {
          userId,
          planId,
          interval,
        },
        trial_period_days: 14, // Optional: 14-day free trial
      },
      allow_promotion_codes: true, // Allow coupon codes
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true,
      },
    })

    console.log(`Created checkout session ${session.id} for user ${userId} - plan: ${planId}`)

    return NextResponse.json({ 
      sessionId: session.id,
      customerId: session.customer,
      url: session.url // Fallback URL if redirect fails
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    
    // Provide more specific error messages
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' 