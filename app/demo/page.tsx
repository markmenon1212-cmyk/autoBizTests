'use client'

import { useState } from 'react'
import { Bot, Sparkles, ArrowRight, CheckCircle, Zap } from 'lucide-react'
import AIWorkflowExecutor from '../components/AIWorkflowExecutor'

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<'demo' | 'features'>('demo')

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI-Powered Automation',
      description: 'Create intelligent workflows that adapt to your business needs',
      examples: [
        'Automated email responses based on customer inquiries',
        'Social media content generation and scheduling',
        'Product description optimization for SEO',
        'Customer support ticket classification'
      ]
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: 'Smart Integrations',
      description: 'Connect all your favorite tools and platforms seamlessly',
      examples: [
        'Gmail and Google Workspace automation',
        'Slack and Twitter/X integration',
        'Shopify and WooCommerce sync',
        'Vercel deployment automation'
      ]
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Intelligent Workflows',
      description: 'Build complex automation chains with visual workflow builder',
      examples: [
        'Multi-step approval processes',
        'Conditional logic and branching',
        'Real-time notifications and alerts',
        'Data transformation and enrichment'
      ]
    }
  ]

  const demoExamples = [
    {
      type: 'email',
      title: 'Email Marketing Automation',
      description: 'Create personalized email campaigns automatically',
      example: 'Welcome email for new customers with product recommendations',
      result: 'Dear [Customer Name],\n\nWelcome to our jewelry boutique! We\'re thrilled to have you join our community of handmade jewelry lovers.\n\nBased on your preferences, we think you\'ll love our new collection of sustainable gemstone necklaces. Each piece is carefully crafted by our artisans using ethically sourced materials.\n\nAs a special welcome gift, enjoy 15% off your first purchase with code WELCOME15.\n\nHappy shopping!\n\nThe Jewelry Team'
    },
    {
      type: 'social',
      title: 'Social Media Content',
      description: 'Generate engaging social media posts',
      example: 'Instagram post announcing new summer collection',
      result: '☀️ Summer vibes are here! 🌊\n\nIntroducing our stunning new Summer Collection featuring handcrafted seashell jewelry that captures the essence of coastal living.\n\n✨ Each piece tells a story\n🌊 Inspired by ocean waves\n💎 Ethically sourced materials\n\nShop the collection now and bring the beach to your everyday style! 🏖️\n\n#SummerCollection #HandmadeJewelry #CoastalVibes #SustainableFashion #JewelryLover'
    },
    {
      type: 'ecommerce',
      title: 'Product Descriptions',
      description: 'Create compelling product descriptions',
      example: 'Product description for handmade necklace',
      result: 'Handcrafted Ocean Wave Necklace\n\nThis exquisite necklace features a delicate wave design inspired by the rhythmic motion of ocean waves. Each piece is meticulously crafted by our skilled artisans using premium sterling silver and genuine freshwater pearls.\n\nPerfect for both casual and formal occasions, this necklace adds a touch of elegance to any outfit. The adjustable chain ensures a perfect fit for every neckline.\n\n• Sterling silver construction\n• Genuine freshwater pearls\n• Adjustable chain length\n• Handcrafted with care\n• Ethically sourced materials'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
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
              <a href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            See AutoBiz AI
            <span className="text-gradient block">In Action</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of AI-powered business automation. Try our interactive demo and see how easy it is to create intelligent workflows.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'demo'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Interactive Demo
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'features'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Features & Examples
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'demo' ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Try Our AI Workflow Executor
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Enter your business task below and watch as our AI creates intelligent, personalized content and automation workflows.
              </p>
            </div>
            <AIWorkflowExecutor />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="card">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-primary-600">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Demo Examples */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Real-World Examples
              </h2>
              <div className="space-y-6">
                {demoExamples.map((example, index) => (
                  <div key={index} className="card">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">
                          {example.type === 'email' ? '📧' : 
                           example.type === 'social' ? '📱' : '🛒'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{example.title}</h3>
                        <p className="text-gray-600 mb-3">{example.description}</p>
                        
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <p className="text-sm text-gray-700">
                            <strong>Input:</strong> {example.example}
                          </p>
                        </div>
                        
                        <div className="bg-primary-50 p-3 rounded-lg border-l-4 border-primary-500">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{example.result}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <div className="card max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Transform Your Business?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of businesses already automating their workflows with AI. Start your free trial today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/dashboard"
                    className="btn-primary flex items-center justify-center"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                  <a
                    href="/pricing"
                    className="btn-secondary flex items-center justify-center"
                  >
                    View Pricing
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 