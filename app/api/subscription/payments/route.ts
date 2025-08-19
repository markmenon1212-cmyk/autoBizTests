import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getPaymentsByUserId } from '../../../../lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payments = await getPaymentsByUserId(userId)
    
    return NextResponse.json({
      payments: payments.map(payment => ({
        id: payment._id?.toString(),
        stripeInvoiceId: payment.stripeInvoiceId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paidAt: payment.paidAt?.toISOString(),
        createdAt: payment.createdAt.toISOString(),
      }))
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' 