import Stripe from 'stripe'

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
}

// Helper function to get or create customer
export async function getOrCreateCustomer(email: string, userId: string) {
  try {
    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      const customer = existingCustomers.data[0]
      
      // Update customer metadata if needed
      if (customer.metadata.userId !== userId) {
        await stripe.customers.update(customer.id, {
          metadata: {
            ...customer.metadata,
            userId,
          },
        })
      }
      
      return customer
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        userId,
      },
    })

    return customer
  } catch (error) {
    console.error('Error getting or creating customer:', error)
    throw error
  }
}

// Helper function to get customer by user ID
export async function getCustomerByUserId(userId: string) {
  try {
    const customers = await stripe.customers.list({
      limit: 100, // Adjust based on your needs
    })

    return customers.data.find(customer => 
      customer.metadata.userId === userId
    )
  } catch (error) {
    console.error('Error getting customer by user ID:', error)
    throw error
  }
}

// Helper function to get subscription by user ID
export async function getSubscriptionByUserId(userId: string) {
  try {
    const customer = await getCustomerByUserId(userId)
    
    if (!customer) {
      return null
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      expand: ['data.default_payment_method', 'data.latest_invoice'],
    })

    return subscriptions.data.find(sub => 
      ['active', 'trialing', 'past_due'].includes(sub.status)
    )
  } catch (error) {
    console.error('Error getting subscription by user ID:', error)
    throw error
  }
}

// Helper function to verify webhook signature
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(body, signature, secret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    throw error
  }
}

// Helper function to format subscription data
export function formatSubscriptionData(subscription: Stripe.Subscription) {
  const plan = subscription.items.data[0]?.price
  
  return {
    id: subscription.id,
    status: subscription.status,
    planId: subscription.metadata.planId,
    interval: subscription.metadata.interval,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    plan: plan ? {
      id: plan.id,
      unitAmount: plan.unit_amount,
      currency: plan.currency,
      interval: plan.recurring?.interval,
      intervalCount: plan.recurring?.interval_count,
    } : null,
    customerId: subscription.customer as string,
  }
}

// Helper function to create checkout session
export async function createCheckoutSession({
  customerId,
  priceId,
  userId,
  planId,
  interval,
  successUrl,
  cancelUrl,
}: {
  customerId?: string
  priceId: string
  userId: string
  planId: string
  interval: string
  successUrl: string
  cancelUrl: string
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        planId,
        interval,
      },
      customer: customerId,
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
        trial_period_days: 14,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true,
      },
    })

    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// Helper function to create customer portal session
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return session
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    throw error
  }
}

// Helper function to cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    return subscription
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    throw error
  }
}

// Helper function to reactivate subscription
export async function reactivateSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })

    return subscription
  } catch (error) {
    console.error('Error reactivating subscription:', error)
    throw error
  }
}

// Helper function to update subscription
export async function updateSubscription(
  subscriptionId: string,
  priceId: string
) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const item = subscription.items.data[0]

    if (!item) {
      throw new Error('No subscription item found')
    }

    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: item.id,
          price: priceId,
        },
      ],
      proration_behavior: 'create_prorations',
    })

    return updatedSubscription
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
} 