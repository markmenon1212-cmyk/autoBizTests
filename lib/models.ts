import { ObjectId } from 'mongodb'

// User model
export interface User {
  _id?: ObjectId
  clerkUserId: string
  email: string
  name?: string
  stripeCustomerId?: string
  createdAt: Date
  updatedAt: Date
}

// Subscription model
export interface Subscription {
  _id?: ObjectId
  userId: ObjectId
  clerkUserId: string
  stripeSubscriptionId: string
  stripeCustomerId: string
  planId: string
  interval: 'month' | 'year'
  status: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  trialEnd?: Date
  plan: {
    id: string
    unitAmount: number
    currency: string
    interval: string
    intervalCount: number
  }
  createdAt: Date
  updatedAt: Date
}

// Payment model for tracking invoices
export interface Payment {
  _id?: ObjectId
  userId: ObjectId
  stripeInvoiceId: string
  stripeSubscriptionId: string
  amount: number
  currency: string
  status: string
  paidAt?: Date
  createdAt: Date
}

// Database collection names
export const COLLECTIONS = {
  USERS: 'users',
  SUBSCRIPTIONS: 'subscriptions',
  PAYMENTS: 'payments',
} as const 