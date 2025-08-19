'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Check, X, Clock, CreditCard, Calendar, Zap, Crown, Users } from 'lucide-react'
import toast from 'react-hot-toast'

interface SubscriptionData {
  id: string
  status: string
  planId: string
  interval: 'month' | 'year'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  trialEnd?: string
  amount: number
  currency: string
  stripeCustomerId: string
  createdAt: string
  updatedAt: string
}

interface UserData {
  id: string
  email: string
  name?: string
  stripeCustomerId?: string
}

interface PaymentData {
  id: string
  stripeInvoiceId: string
  amount: number
  currency: string
  status: string
  paidAt?: string
  createdAt: string
}

export default function SubscriptionStatus() {
  const { isSignedIn, user } = useUser()
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSignedIn) {
      fetchSubscriptionData()
    }
  }, [isSignedIn])

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching subscription data...')
      
      const response = await fetch('/api/subscription')
      console.log('📡 Subscription API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📊 Subscription data received:', data)
        
        setSubscriptionData(data.subscription)
        setUserData(data.customer)
        
        // Fetch payments if user has a subscription
        if (data.subscription) {
          console.log('💰 Fetching payment history...')
          await fetchPayments()
        } else {
          console.log('ℹ️ No active subscription found')
        }
      } else {
        const errorData = await response.json()
        console.error('❌ Subscription API error:', errorData)
        toast.error('Failed to load subscription data')
      }
    } catch (error) {
      console.error('❌ Error fetching subscription:', error)
      toast.error('Failed to load subscription data')
    } finally {
      setLoading(false)
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/subscription/payments')
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments || [])
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    }
  }



  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'starter':
        return <Zap className="w-5 h-5" />
      case 'professional':
        return <Users className="w-5 h-5" />
      case 'enterprise':
        return <Crown className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  const getPlanName = (planId: string) => {
    switch (planId) {
      case 'starter':
        return 'Starter'
      case 'professional':
        return 'Professional'
      case 'enterprise':
        return 'Enterprise'
      default:
        return 'Unknown Plan'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'trialing':
        return 'text-blue-600 bg-blue-100'
      case 'past_due':
        return 'text-yellow-600 bg-yellow-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number, currency?: string) => {
    const safeCurrency = currency?.toUpperCase() || 'USD'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: safeCurrency,
    }).format(amount / 100)
  }

  if (!isSignedIn) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view your subscription</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading subscription...</p>
      </div>
    )
  }

  if (!subscriptionData) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
        <p className="text-gray-600 mb-4">
          You don't have an active subscription. Choose a plan to get started.
        </p>
        <a
          href="/pricing"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          View Plans
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Subscription Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              {getPlanIcon(subscriptionData.planId)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {getPlanName(subscriptionData.planId)} Plan
              </h3>
              <p className="text-sm text-gray-600">
                {subscriptionData.interval === 'month' ? 'Monthly' : 'Yearly'} billing
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscriptionData.status)}`}>
            {subscriptionData.status.charAt(0).toUpperCase() + subscriptionData.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Current Period</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(subscriptionData.currentPeriodStart)} - {formatDate(subscriptionData.currentPeriodEnd)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(subscriptionData.amount, subscriptionData.currency)}/{subscriptionData.interval}
              </p>
            </div>
          </div>

          {subscriptionData.trialEnd && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Trial Ends</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(subscriptionData.trialEnd)}
                </p>
              </div>
            </div>
          )}
        </div>

        {subscriptionData.cancelAtPeriodEnd && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Your subscription will be cancelled at the end of the current period on{' '}
                {formatDate(subscriptionData.currentPeriodEnd)}.
              </p>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <a
            href="/pricing"
            className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-center inline-flex items-center justify-center"
          >
            Manage Billing
          </a>
          
          {subscriptionData.cancelAtPeriodEnd && (
            <button
              onClick={() => {/* TODO: Implement reactivation */}}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reactivate
            </button>
          )}
        </div>
      </div>

      {/* Payment History */}
      {payments.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    payment.status === 'succeeded' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {payment.status === 'succeeded' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {payment.paidAt ? formatDate(payment.paidAt) : 'Pending'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  payment.status === 'succeeded' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 