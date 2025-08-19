import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUserByClerkId, getSubscriptionByUserId, getUserWithSubscription } from '../../../lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🔍 Fetching subscription for user:', userId)

    // Get user and subscription data from MongoDB
    const userData = await getUserWithSubscription(userId)
    
    if (!userData.user) {
      console.log('❌ User not found in database for clerk ID:', userId)
      return NextResponse.json({
        hasSubscription: false,
        subscription: null,
        customer: null
      })
    }

    console.log('✅ Found user in database:', userData.user._id)

    if (!userData.subscription) {
      console.log('ℹ️ No subscription found for user')
      return NextResponse.json({
        hasSubscription: false,
        subscription: null,
        customer: {
          id: userData.user.stripeCustomerId || null,
          email: userData.user.email,
          name: userData.user.name,
        }
      })
    }

    console.log('✅ Found subscription:', userData.subscription._id)
    console.log('📊 Subscription data structure:', {
      planId: userData.subscription.planId,
      interval: userData.subscription.interval,
      status: userData.subscription.status,
      hasPlan: !!userData.subscription.plan,
      planKeys: userData.subscription.plan ? Object.keys(userData.subscription.plan) : 'No plan object'
    })

    // Format subscription data from MongoDB with safe property access
    const subscriptionData = {
      id: userData.subscription.stripeSubscriptionId,
      status: userData.subscription.status,
      planId: userData.subscription.planId,
      interval: userData.subscription.interval,
      currentPeriodStart: userData.subscription.currentPeriodStart,
      currentPeriodEnd: userData.subscription.currentPeriodEnd,
      cancelAtPeriodEnd: userData.subscription.cancelAtPeriodEnd,
      trialEnd: userData.subscription.trialEnd,
      amount: userData.subscription.plan?.unitAmount || 0,
      currency: userData.subscription.plan?.currency || 'USD',
      stripeCustomerId: userData.subscription.stripeCustomerId,
      createdAt: userData.subscription.createdAt,
      updatedAt: userData.subscription.updatedAt
    }

    // Log the formatted data for debugging
    console.log('📋 Formatted subscription data:', {
      id: subscriptionData.id,
      planId: subscriptionData.planId,
      amount: subscriptionData.amount,
      currency: subscriptionData.currency
    })

    // Ensure currency is always a valid string
    if (typeof subscriptionData.currency !== 'string') {
      console.warn('⚠️ Currency is not a string, defaulting to USD:', subscriptionData.currency)
      subscriptionData.currency = 'USD'
    }

    return NextResponse.json({
      hasSubscription: true,
      subscription: subscriptionData,
      customer: {
        id: userData.user.stripeCustomerId || null,
        email: userData.user.email,
        name: userData.user.name,
      }
    })

  } catch (error) {
    console.error('❌ Subscription fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { subscriptionId } = await request.json()
    
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID required' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await getUserByClerkId(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get subscription from database
    const subscription = await getSubscriptionByUserId(userId)
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // For now, we'll return a message that cancellation should be done through Stripe
    // In the future, you could implement cancellation through your own API
    return NextResponse.json({
      message: 'Please cancel your subscription through the billing portal or contact support',
      subscription: {
        id: subscription.stripeSubscriptionId,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        currentPeriodEnd: subscription.currentPeriodEnd,
      }
    })

  } catch (error) {
    console.error('❌ Subscription cancellation error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' 