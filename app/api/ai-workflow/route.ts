import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { connectToDatabase } from '@/lib/mongodb'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    // For demo purposes, allow requests without authentication
    // In production, you would want to require authentication
    // if (!userId) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const { workflow, input, context } = await request.json()

    // Create AI prompt based on workflow type
    let systemPrompt = ''
    let userPrompt = ''

    switch (workflow.type) {
      case 'email':
        systemPrompt = `You are an AI assistant that helps create personalized email content for any purpose. 
        Create engaging, professional email content based on the user's request. 
        Adapt to any business context, industry, or personal situation mentioned in the prompt.`
        userPrompt = `Create an email for: ${input}
        Context: ${context}
        Tone: Professional but friendly
        Length: 150-200 words
        Note: Create content that matches exactly what the user requested, regardless of industry or business type.`
        break
        
      case 'social':
        systemPrompt = `You are an AI assistant that creates engaging social media content for any business or purpose.
        Create content that is shareable, engaging, and appropriate for the specified platform and context.`
        userPrompt = `Create social media content for: ${input}
        Context: ${context}
        Tone: Engaging and professional
        Include relevant hashtags
        Note: Adapt to any industry, business type, or context mentioned in the prompt.`
        break
        
      case 'ecommerce':
        systemPrompt = `You are an AI assistant that helps with e-commerce automation tasks for any type of business.
        Provide helpful responses for product descriptions, customer service, and inventory management.`
        userPrompt = `E-commerce task: ${input}
        Context: ${context}
        Provide a helpful, accurate response
        Note: Work with any product, service, or business type mentioned in the prompt.`
        break
        
      default:
        systemPrompt = `You are an AI assistant that helps with business automation tasks for any industry or purpose.
        Provide helpful, professional responses that add value to the business workflow.`
        userPrompt = `Task: ${input}
        Context: ${context}
        Provide a helpful response
        Note: Adapt to any business context, industry, or situation mentioned in the prompt.`
    }

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash'});
    const prompt = `${systemPrompt}\n\n${userPrompt}`;
    const result = await model.generateContent(prompt);
    const response = result.response;

    const aiResponse = response.text() || 'No response generated'

    // Log to MongoDB
    try {
      const db = await connectToDatabase()
      await db.collection('workflow_executions').insertOne({
        userId: userId || 'demo-user',
        workflowId: workflow.id,
        type: workflow.type,
        input,
        response: aiResponse,
        timestamp: new Date()
      })
    } catch (mongoError) {
      console.error('Failed to log to MongoDB:', mongoError)
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      workflowId: workflow.id,
      executionId: Date.now().toString()
    })

  } catch (error) {
    console.error('AI workflow error:', error)
    return NextResponse.json(
      { error: 'Failed to process workflow' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
