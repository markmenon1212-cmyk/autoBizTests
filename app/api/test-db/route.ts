import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import { COLLECTIONS } from '../../../lib/models'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...')
    
    const db = await connectToDatabase()
    
    // Test basic operations
    const testUser = {
      clerkUserId: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Insert test user
    const userResult = await db.collection(COLLECTIONS.USERS).insertOne(testUser)
    console.log('Test user inserted:', userResult.insertedId)
    
    // Test subscription
    const testSubscription = {
      userId: userResult.insertedId,
      clerkUserId: 'test-user-123',
      stripeSubscriptionId: 'sub_test_123',
      stripeCustomerId: 'cus_test_123',
      planId: 'starter',
      interval: 'month' as const,
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
      plan: {
        id: 'price_test_123',
        unitAmount: 2900,
        currency: 'usd',
        interval: 'month',
        intervalCount: 1,
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const subscriptionResult = await db.collection(COLLECTIONS.SUBSCRIPTIONS).insertOne(testSubscription)
    console.log('Test subscription inserted:', subscriptionResult.insertedId)
    
    // Test payment
    const testPayment = {
      userId: userResult.insertedId,
      stripeInvoiceId: 'in_test_123',
      stripeSubscriptionId: 'sub_test_123',
      amount: 2900,
      currency: 'usd',
      status: 'succeeded',
      paidAt: new Date(),
      createdAt: new Date()
    }
    
    const paymentResult = await db.collection(COLLECTIONS.PAYMENTS).insertOne(testPayment)
    console.log('Test payment inserted:', paymentResult.insertedId)
    
    // List all collections
    const collections = await db.listCollections().toArray()
    
    // Count documents in each collection
    const userCount = await db.collection(COLLECTIONS.USERS).countDocuments()
    const subscriptionCount = await db.collection(COLLECTIONS.SUBSCRIPTIONS).countDocuments()
    const paymentCount = await db.collection(COLLECTIONS.PAYMENTS).countDocuments()
    
    // Clean up test data
    await db.collection(COLLECTIONS.USERS).deleteOne({ _id: userResult.insertedId })
    await db.collection(COLLECTIONS.SUBSCRIPTIONS).deleteOne({ _id: subscriptionResult.insertedId })
    await db.collection(COLLECTIONS.PAYMENTS).deleteOne({ _id: paymentResult.insertedId })
    
    return NextResponse.json({
      success: true,
      message: 'Database test completed successfully',
      collections: collections.map((col: any) => col.name),
      counts: {
        users: userCount,
        subscriptions: subscriptionCount,
        payments: paymentCount
      },
      testResults: {
        userInserted: !!userResult.insertedId,
        subscriptionInserted: !!subscriptionResult.insertedId,
        paymentInserted: !!paymentResult.insertedId
      }
    })
    
  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' 