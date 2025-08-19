import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { 
  ensureUserExists, 
  createSubscription, 
  updateSubscription, 
  createPayment,
  linkUserToStripeCustomer,
  getUserByClerkId
} from '../../../../lib/db'
import { ObjectId } from 'mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
console.log('🔑 Webhook secret:', webhookSecret)

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Webhook received - processing...')
    
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    console.log('📝 Request body length:', body.length)
    console.log('🔑 Signature present:', !!signature)

    if (!signature) {
      console.error('❌ No Stripe signature found')
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log('✅ Webhook signature verified successfully')
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('📨 Received Stripe webhook event:', event.type)
    console.log('🆔 Event ID:', event.id)
    console.log('📅 Event created:', new Date(event.created * 1000).toISOString())

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
      )
  }
}

// Handle successful checkout completion
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Payment successful for session:', session.id)
    
    const { userId, planId, interval } = session.metadata || {}
    
    if (!userId || !planId) {
      console.error('Missing metadata in checkout session:', session.id)
      return
    }

    // Ensure user exists in our database
    const user = await ensureUserExists(userId, `user-${userId}@example.com`, `User ${userId}`)
    
    // Link user to Stripe customer if not already linked
    if (session.customer && !user.stripeCustomerId) {
      await linkUserToStripeCustomer(userId, session.customer as string)
    }
    
    console.log(`User ${userId} successfully subscribed to ${planId} plan (${interval})`)
    
    // Note: The actual subscription will be created when we receive the subscription.created event
    // This event just confirms the checkout was successful
    
  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

// Handle new subscription creation
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription created:', subscription.id)
    
    const { userId, planId, interval } = subscription.metadata || {}
    
    if (!userId || !planId) {
      console.error('Missing metadata in subscription:', subscription.id)
      return
    }

    // Ensure user exists
    const user = await ensureUserExists(userId, `user-${userId}@example.com`, `User ${userId}`)
    
    // Get plan details
    const plan = subscription.items.data[0]?.price
    if (!plan) {
      console.error('No plan found in subscription:', subscription.id)
      return
    }

    // Create subscription in our database
    await createSubscription({
      userId: user._id!,
      clerkUserId: userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      planId,
      interval: interval as 'month' | 'year',
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
      plan: {
        id: plan.id,
        unitAmount: plan.unit_amount || 0,
        currency: plan.currency,
        interval: plan.recurring?.interval || 'month',
        intervalCount: plan.recurring?.interval_count || 1,
      },
    })
    
    console.log(`Subscription ${subscription.id} saved to database for user ${userId}`)
    
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription updated:', subscription.id)
    
    const { userId, planId } = subscription.metadata || {}
    
    if (!userId || !planId) {
      console.error('Missing metadata in subscription update:', subscription.id)
      return
    }

    // Update subscription in our database
    await updateSubscription(subscription.id, {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
    })
    
    console.log(`Subscription ${subscription.id} updated in database`)
    
  } catch (error) {
    console.error('Error handling subscription updated:', error)
  }
}

// Handle subscription cancellation
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription cancelled:', subscription.id)
    
    const { userId } = subscription.metadata || {}
    
    if (!userId) {
      console.error('Missing userId in subscription deletion:', subscription.id)
      return
    }

    // TODO: Update subscription status in your database
    // await updateUserSubscription(userId, {
    //   status: 'cancelled',
    //   cancelledAt: new Date()
    // })
    
  } catch (error) {
    console.error('Error handling subscription deleted:', error)
  }
}

// Handle successful payments
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log('Payment succeeded for invoice:', invoice.id)
    
    if (invoice.subscription) {
      // Get subscription to find user
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
      const { userId } = subscription.metadata || {}
      
      if (userId && invoice.amount_paid) {
        // Get user from our database
        const user = await getUserByClerkId(userId)
        
        if (user && user._id) {
          // Save payment to database
          await createPayment({
            userId: user._id,
            stripeInvoiceId: invoice.id,
            stripeSubscriptionId: invoice.subscription as string,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: 'succeeded',
            paidAt: new Date(invoice.status_transitions?.paid_at ? invoice.status_transitions.paid_at * 1000 : Date.now()),
          })
          
          console.log(`Payment ${invoice.id} saved to database`)
        }
      }
    }
    
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

// Handle failed payments
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log('Payment failed for invoice:', invoice.id)
    
    if (invoice.subscription) {
      // TODO: Update subscription status in your database
      // await updateSubscriptionPaymentStatus(invoice.subscription as string, 'failed')
      
      // TODO: Send notification to user about failed payment
      // await sendPaymentFailedNotification(invoice.customer as string)
    }
    
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

// Handle new customer creation
async function handleCustomerCreated(customer: Stripe.Customer) {
  try {
    console.log('Customer created:', customer.id)
    
    // TODO: Store customer information in your database
    // await createCustomer({
    //   stripeCustomerId: customer.id,
    //   email: customer.email,
    //   name: customer.name,
    //   createdAt: new Date()
    // })
    
  } catch (error) {
    console.error('Error handling customer created:', error)
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' 