# 💳 Complete Stripe Integration Guide for AutoBiz AI

This guide will walk you through setting up real Stripe integration for your pricing page, including creating products, prices, webhooks, and updating your code.

## 🚀 Prerequisites

- ✅ Stripe account (free to create)
- ✅ AutoBiz AI project with Stripe dependencies already installed
- ✅ Clerk authentication set up
- ✅ Environment variables configured

## 🔑 Step 1: Stripe Dashboard Setup

### 1.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete account verification
3. Switch to **Live mode** when ready (or stay in **Test mode** for development)

### 1.2 Get API Keys
1. Go to **Developers** → **API keys**
2. Copy your **Publishable key** and **Secret key**
3. **Important**: Keep your secret key secure and never expose it in frontend code

## 🛍️ Step 2: Create Products & Prices in Stripe

### 2.1 Create Products
In your Stripe Dashboard, go to **Products** and create these products:

#### Starter Plan Product
- **Name**: `AutoBiz AI Starter`
- **Description**: `Perfect for small businesses getting started with automation`
- **Metadata**: 
  - `plan_id`: `starter`
  - `features`: `5 workflows, Gmail, Basic social, Standard support, 1K AI ops`

#### Professional Plan Product
- **Name**: `AutoBiz AI Professional`
- **Description**: `Advanced features for growing businesses`
- **Metadata**:
  - `plan_id`: `professional`
  - `features`: `25 workflows, All providers, E-commerce, Priority support, 10K AI ops`

#### Enterprise Plan Product
- **Name**: `AutoBiz AI Enterprise`
- **Description**: `Full automation suite for large organizations`
- **Metadata**:
  - `plan_id`: `enterprise`
  - `features`: `Unlimited workflows, All integrations, Custom AI, Dedicated support`

### 2.2 Create Prices
For each product, create **two prices** (monthly and yearly):

#### Starter Plan Prices
- **Monthly**: $29/month (recurring)
- **Yearly**: $290/year (recurring, 20% discount)

#### Professional Plan Prices
- **Monthly**: $79/month (recurring)
- **Yearly**: $790/year (recurring, 20% discount)

#### Enterprise Plan Prices
- **Monthly**: $199/month (recurring)
- **Yearly**: $1990/year (recurring, 20% discount)

### 2.3 Get Price IDs
After creating prices, copy the **Price IDs** (they start with `price_`). You'll need these for your code.

## 🔧 Step 3: Update Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**For production**, update with your live Stripe keys and actual domain.

## 📝 Step 4: Update Pricing Page with Real Price IDs

Replace the hardcoded `stripePriceId` values in your pricing page:

```typescript:app/pricing/page.tsx
// ... existing code ...

const plans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: billingInterval === 'month' ? 29 : 290,
    interval: billingInterval,
    description: 'Perfect for small businesses getting started with automation',
    features: [
      'Up to 5 active workflows',
      'Email automation (Gmail)',
      'Basic social media posting',
      'Standard support',
      '1,000 AI operations/month',
      'Basic analytics'
    ],
    icon: <Zap className="w-6 h-6" />,
    // Replace with your actual Stripe price IDs
    stripePriceId: billingInterval === 'month' 
      ? 'price_1OaBcDeFgHiJkLmNoPqRsT' // Your monthly starter price ID
      : 'price_1OaBcDeFgHiJkLmNoPqRsU' // Your yearly starter price ID
  },
  {
    id: 'professional',
    name: 'Professional',
    price: billingInterval === 'month' ? 79 : 790,
    interval: billingInterval,
    description: 'Advanced features for growing businesses',
    features: [
      'Up to 25 active workflows',
      'All email providers',
      'Advanced social media automation',
      'E-commerce integrations',
      'Priority support',
      '10,000 AI operations/month',
      'Advanced analytics & reporting',
      'Custom webhooks',
      'Team collaboration'
    ],
    popular: true,
    icon: <Users className="w-6 h-6" />,
    // Replace with your actual Stripe price IDs
    stripePriceId: billingInterval === 'month'
      ? 'price_1OaBcDeFgHiJkLmNoPqRsV' // Your monthly professional price ID
      : 'price_1OaBcDeFgHiJkLmNoPqRsW' // Your yearly professional price ID
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: billingInterval === 'month' ? 199 : 1990,
    interval: billingInterval,
    description: 'Full automation suite for large organizations',
    features: [
      'Unlimited active workflows',
      'All integrations included',
      'Custom AI model training',
      'Dedicated account manager',
      '24/7 phone support',
      'Unlimited AI operations',
      'Advanced security & compliance',
      'Custom integrations',
      'White-label options',
      'API access'
    ],
    icon: <Crown className="w-6 h-6" />,
    // Replace with your actual Stripe price IDs
    stripePriceId: billingInterval === 'month'
      ? 'price_1OaBcDeFgHiJkLmNoPqRsX' // Your monthly enterprise price ID
      : 'price_1OaBcDeFgHiJkLmNoPqRsY' // Your yearly enterprise price ID
  }
]

// ... existing code ...
```

## 🔗 Step 5: Set Up Stripe Webhooks

### 5.1 Create Webhook Endpoint
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://your-domain.com/api/webhooks/stripe`
4. **Events to send**: Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 5.2 Get Webhook Secret
After creating the webhook, copy the **Signing secret** (starts with `whsec_`).

## 📡 Step 6: Create Webhook Handler

Create a new file for handling Stripe webhooks:

```typescript:app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Payment successful for session:', session.id)
        // Here you would:
        // 1. Update user's subscription status in your database
        // 2. Send welcome email
        // 3. Grant access to features
        break

      case 'customer.subscription.created':
        const subscription = event.data.object as Stripe.Subscription
        console.log('Subscription created:', subscription.id)
        // Handle new subscription
        break

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription
        console.log('Subscription updated:', updatedSubscription.id)
        // Handle subscription changes
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        console.log('Subscription cancelled:', deletedSubscription.id)
        // Handle subscription cancellation
        break

      case 'invoice.payment_failed':
        const invoice = event.data.object as Stripe.Invoice
        console.log('Payment failed for invoice:', invoice.id)
        // Handle failed payments
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
```

## 🎯 Step 7: Update Checkout API Route

Your existing checkout route looks good, but let's add some improvements:

```typescript:app/api/create-checkout-session/route.ts
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
        { error: 'Missing required fields' },
        { status: 400 }
      )
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
      // Add customer creation if they don't exist
      customer_creation: 'always',
      // Enable customer portal
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      // Add subscription data
      subscription_data: {
        metadata: {
          userId,
          planId,
          interval,
        },
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

## 🔐 Step 8: Add Customer Portal Support

Create an API route for managing subscriptions:

```typescript:app/api/create-portal-session/route.ts
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

    // Get customer ID from your database or Stripe
    // For now, we'll search by email (you should store customer IDs in your database)
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      )
    }

    // Find customer in Stripe
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    const customer = customers.data[0]

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
```

## 🧪 Step 9: Testing Your Integration

### 9.1 Test Mode
1. Use Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Expiry**: Any future date
   - **CVC**: Any 3 digits

### 9.2 Test Scenarios
1. **Successful subscription**
2. **Failed payment**
3. **Subscription cancellation**
4. **Plan upgrades/downgrades**

## 🚀 Step 10: Production Deployment

### 10.1 Switch to Live Mode
1. In Stripe Dashboard, toggle to **Live mode**
2. Update environment variables with live keys
3. Update webhook endpoints with production URLs
4. Test with real cards (small amounts)

### 10.2 Environment Variables for Production
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🔍 Troubleshooting Common Issues

### Issue: "Invalid price ID" error
**Solution**: Double-check your price IDs in Stripe Dashboard

### Issue: Webhook not receiving events
**Solution**: 
1. Verify webhook URL is accessible
2. Check webhook secret matches
3. Ensure endpoint is HTTPS (required for production)

### Issue: Checkout session creation fails
**Solution**:
1. Verify Stripe secret key is correct
2. Check price ID exists and is active
3. Ensure all required fields are provided

## 📊 Monitoring & Analytics

### Stripe Dashboard
- Monitor payments, subscriptions, and customer activity
- Set up alerts for failed payments
- Track revenue and growth metrics

### Your Application
- Log all webhook events
- Track subscription status changes
- Monitor checkout conversion rates

## 🎉 Next Steps

1. **Test thoroughly** in Stripe test mode
2. **Set up customer database** to track subscriptions
3. **Implement subscription management** in your dashboard
4. **Add usage tracking** for AI operations
5. **Set up email notifications** for subscription events
6. **Monitor and optimize** conversion rates

---

## 📋 Quick Checklist

- [ ] Create Stripe account and get API keys
- [ ] Create products and prices in Stripe Dashboard
- [ ] Update pricing page with real price IDs
- [ ] Set up webhook endpoint
- [ ] Create webhook handler
- [ ] Test checkout flow
- [ ] Test webhook events
- [ ] Deploy to production
- [ ] Switch to live mode

Your AutoBiz AI pricing page is now ready for real payments! 🚀 