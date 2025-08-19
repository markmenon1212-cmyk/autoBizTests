'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Check, Star, Zap, Crown, Users } from 'lucide-react'
import toast from 'react-hot-toast'

interface PricingPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  description: string
  features: string[]
  popular?: boolean
  icon: React.ReactNode
  stripePriceId: string
}

export default function PricingPage() {
  const { isSignedIn, user } = useUser()
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')
  const [loading, setLoading] = useState<string | null>(null)
  const [currentSubscription, setCurrentSubscription] = useState<any>(null)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)

  // Validate environment variables
  useEffect(() => {
    const requiredEnvVars = [
      'NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID',
      'NEXT_PUBLIC_STRIPE_STARTER_YEARLY_PRICE_ID',
      'NEXT_PUBLIC_STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID',
      'NEXT_PUBLIC_STRIPE_PROFESSIONAL_YEARLY_PRICE_ID',
      'NEXT_PUBLIC_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID',
      'NEXT_PUBLIC_STRIPE_ENTERPRISE_YEARLY_PRICE_ID'
    ]

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:', missingVars)
      toast.error('Configuration error: Missing Stripe price IDs')
    } else {
      console.log('✅ All Stripe price ID environment variables are loaded')
    }
  }, [])

  // Fetch current subscription when user is signed in
  useEffect(() => {
    if (isSignedIn) {
      fetchCurrentSubscription()
    } else {
      setSubscriptionLoading(false)
    }
  }, [isSignedIn])

  const fetchCurrentSubscription = async () => {
    try {
      console.log('🔄 Fetching current subscription...')
      const response = await fetch('/api/subscription')
      console.log('📡 Subscription API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📊 Subscription data received:', data)
        setCurrentSubscription(data.subscription)
      } else {
        const errorData = await response.json()
        console.error('❌ Subscription API error:', errorData)
      }
    } catch (error) {
      console.error('❌ Error fetching subscription:', error)
    } finally {
      setSubscriptionLoading(false)
    }
  }

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
      stripePriceId: billingInterval === 'month' 
        ? process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID!
        : process.env.NEXT_PUBLIC_STRIPE_STARTER_YEARLY_PRICE_ID!
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
      stripePriceId: billingInterval === 'month' 
        ? process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID!
        : process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_YEARLY_PRICE_ID!
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
      stripePriceId: billingInterval === 'month' 
        ? process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID!
        : process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_YEARLY_PRICE_ID!
    }
  ]

  const handleSubscribe = async (plan: PricingPlan) => {
    // If user already has a subscription, redirect to dashboard
    if (currentSubscription) {
      toast('You already have an active subscription. Manage it from your dashboard.')
      window.location.href = '/dashboard'
      return
    }

    // Check if price ID is available
    if (!plan.stripePriceId) {
      toast.error('Configuration error: Stripe price ID not found for this plan')
      console.error('❌ Missing Stripe price ID for plan:', plan.id)
      return
    }

    setLoading(plan.id)
    
    try {
      // In a real app, this would call your API to create a Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          planId: plan.id,
          interval: billingInterval
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const stripe = await import('@stripe/stripe-js')
      const stripeInstance = await stripe.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      await stripeInstance?.redirectToCheckout({ sessionId })
      
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error('Failed to start subscription. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gradient">
                AutoBiz AI
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="text-gradient block">Automation Plan</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Scale your business with AI-powered automation. Start free, grow with confidence.
          </p>



          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${billingInterval === 'month' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingInterval(billingInterval === 'month' ? 'year' : 'month')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600 transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingInterval === 'year' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingInterval === 'year' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Current Subscription Status */}
        {isSignedIn && subscriptionLoading && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-blue-700">Loading subscription information...</p>
            </div>
          </div>
        )}
        
        {isSignedIn && !subscriptionLoading && currentSubscription && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">
                      Active Subscription: {currentSubscription.planId ? currentSubscription.planId.charAt(0).toUpperCase() + currentSubscription.planId.slice(1) : 'Unknown'} Plan
                    </h3>
                    <p className="text-sm text-green-700">
                      {currentSubscription.interval ? (currentSubscription.interval === 'month' ? 'Monthly' : 'Yearly') : 'Unknown'} billing • 
                      Status: {currentSubscription.status ? currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1) : 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <a
                    href="/dashboard"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Go to Dashboard
                  </a>
                  <a
                    href="/dashboard"
                    className="bg-white text-green-600 border border-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    Manage Billing
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative card ${plan.popular ? 'ring-2 ring-primary-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600">
                    {plan.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/{billingInterval}</span>
                </div>

                {isSignedIn ? (
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading === plan.id}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading === plan.id ? 'Processing...' : 'Get Started'}
                  </button>
                ) : (
                  <a
                    href="/sign-up"
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors text-center ${
                      plan.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Sign Up to Subscribe
                  </a>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 14-day free trial on all plans. No credit card required to start.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I exceed my limits?
              </h3>
              <p className="text-gray-600">
                We'll notify you when you're approaching limits. You can upgrade anytime to continue.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Absolutely. Cancel anytime from your dashboard. No long-term contracts or hidden fees.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Automate Your Business?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of businesses saving time and growing revenue with AI automation.
          </p>
          {isSignedIn ? (
            <a
              href="/dashboard"
              className="btn-primary text-lg px-8 py-3 inline-flex items-center"
            >
              Go to Dashboard
              <Zap className="w-5 h-5 ml-2" />
            </a>
          ) : (
            <div className="flex justify-center space-x-4">
              <a
                href="/sign-up"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center"
              >
                Get Started Free
                <Zap className="w-5 h-5 ml-2" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 