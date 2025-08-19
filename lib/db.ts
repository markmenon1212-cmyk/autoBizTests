import { connectToDatabase } from './mongodb'
import { User, Subscription, Payment, COLLECTIONS } from './models'
import { ObjectId } from 'mongodb'

// User operations
export async function createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const db = await connectToDatabase()
  
  const now = new Date()
  const user: Omit<User, '_id'> = {
    ...userData,
    createdAt: now,
    updatedAt: now,
  }
  
  const result = await db.collection(COLLECTIONS.USERS).insertOne(user)
  return { ...user, _id: result.insertedId }
}

export async function getUserByClerkId(clerkUserId: string): Promise<User | null> {
  const db = await connectToDatabase()
  
  const user = await db.collection(COLLECTIONS.USERS).findOne({ clerkUserId })
  return user as User | null
}

export async function getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | null> {
  const db = await connectToDatabase()
  
  const user = await db.collection(COLLECTIONS.USERS).findOne({ stripeCustomerId })
  return user as User | null
}

export async function updateUser(clerkUserId: string, updates: Partial<User>): Promise<void> {
  const db = await connectToDatabase()
  
  await db.collection(COLLECTIONS.USERS).updateOne(
    { clerkUserId },
    { 
      $set: { 
        ...updates, 
        updatedAt: new Date() 
      } 
    }
  )
}

// Subscription operations
export async function createSubscription(subscriptionData: Omit<Subscription, '_id' | 'createdAt' | 'updatedAt'>): Promise<Subscription> {
  const db = await connectToDatabase()
  
  const now = new Date()
  const subscription: Omit<Subscription, '_id'> = {
    ...subscriptionData,
    createdAt: now,
    updatedAt: now,
  }
  
  const result = await db.collection(COLLECTIONS.SUBSCRIPTIONS).insertOne(subscription)
  return { ...subscription, _id: result.insertedId }
}

export async function getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | null> {
  const db = await connectToDatabase()
  
  const subscription = await db.collection(COLLECTIONS.SUBSCRIPTIONS).findOne({ stripeSubscriptionId })
  return subscription as Subscription | null
}

export async function getSubscriptionByUserId(clerkUserId: string): Promise<Subscription | null> {
  const db = await connectToDatabase()
  
  const subscription = await db.collection(COLLECTIONS.SUBSCRIPTIONS).findOne({ 
    clerkUserId,
    status: { $in: ['active', 'trialing', 'past_due'] }
  })
  return subscription as Subscription | null
}

export async function updateSubscription(stripeSubscriptionId: string, updates: Partial<Subscription>): Promise<void> {
  const db = await connectToDatabase()
  
  await db.collection(COLLECTIONS.SUBSCRIPTIONS).updateOne(
    { stripeSubscriptionId },
    { 
      $set: { 
        ...updates, 
        updatedAt: new Date() 
      } 
    }
  )
}

export async function cancelSubscription(stripeSubscriptionId: string): Promise<void> {
  await updateSubscription(stripeSubscriptionId, {
    status: 'cancelled',
    cancelAtPeriodEnd: true,
  })
}

// Payment operations
export async function createPayment(paymentData: Omit<Payment, '_id' | 'createdAt'>): Promise<Payment> {
  const db = await connectToDatabase()
  
  const payment: Omit<Payment, '_id'> = {
    ...paymentData,
    createdAt: new Date(),
  }
  
  const result = await db.collection(COLLECTIONS.PAYMENTS).insertOne(payment)
  return { ...payment, _id: result.insertedId }
}

export async function getPaymentsByUserId(clerkUserId: string): Promise<Payment[]> {
  const db = await connectToDatabase()
  
  const payments = await db.collection(COLLECTIONS.PAYMENTS)
    .find({ clerkUserId })
    .sort({ createdAt: -1 })
    .toArray()
  
  return payments as Payment[]
}

// Combined operations
export async function getUserWithSubscription(clerkUserId: string): Promise<{
  user: User | null
  subscription: Subscription | null
  payments: Payment[]
}> {
  const user = await getUserByClerkId(clerkUserId)
  if (!user) {
    return { user: null, subscription: null, payments: [] }
  }
  
  const subscription = await getSubscriptionByUserId(clerkUserId)
  const payments = await getPaymentsByUserId(clerkUserId)
  
  return { user, subscription, payments }
}

// Utility functions
export async function ensureUserExists(clerkUserId: string, email: string, name?: string): Promise<User> {
  let user = await getUserByClerkId(clerkUserId)
  
  if (!user) {
    user = await createUser({
      clerkUserId,
      email,
      name,
    })
  }
  
  return user
}

export async function linkUserToStripeCustomer(clerkUserId: string, stripeCustomerId: string): Promise<void> {
  await updateUser(clerkUserId, { stripeCustomerId })
} 