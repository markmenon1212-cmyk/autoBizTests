'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { ArrowRight, Zap, Shield, BarChart3, Bot, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { isSignedIn, user } = useUser()
  const [email, setEmail] = useState('')

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI-Powered Automation',
      description: 'Automate content creation, SEO optimization, and reputation management with intelligent workflows.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Integrations',
      description: 'Connect your existing tools securely with OAuth2 and enterprise-grade security.'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Analytics & Insights',
      description: 'Get real-time analytics and actionable insights to grow your business.'
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: 'Smart Workflows',
      description: 'Create custom automation workflows that adapt to your business needs.'
    }
  ]

  const integrations = [
    'Gmail & Google Workspace',
    'Slack & Twitter/X',
    'Shopify & WooCommerce',
    'Vercel & Namecheap',
    'Google Business Profile',
    'WhatsApp Business'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gradient">
                AutoBiz AI
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/demo" className="text-gray-600 hover:text-gray-900">Demo</a>
              <a href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              {isSignedIn ? (
                <Link href="/dashboard" className="btn-primary">
                  Dashboard
                </Link>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="btn-secondary">Sign In</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="btn-primary">Get Started</button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Automate Your Business with
              <span className="text-gradient block">AI-Powered Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Seamlessly integrate your websites, social channels, and e-commerce stores. 
              Let AI handle content creation, SEO, and reputation management automatically.
            </p>
            
            {!isSignedIn && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <SignUpButton mode="modal">
                  <button className="btn-primary text-lg px-8 py-3 flex items-center gap-2">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </SignUpButton>
                <button className="btn-secondary text-lg px-8 py-3">
                  Watch Demo
                </button>
              </div>
            )}

            {/* Email Signup */}
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field flex-1"
                />
                <button className="btn-primary whitespace-nowrap">
                  Get Early Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful integrations and AI workflows designed for modern businesses
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center group hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-300">
                  <div className="text-primary-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Native Integrations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect all your favorite tools and platforms seamlessly
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{integration}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of businesses automating their workflows with AI
          </p>
          {!isSignedIn && (
            <SignUpButton mode="modal">
              <button className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
                Start Your Free Trial
              </button>
            </SignUpButton>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-gradient mb-4">
                AutoBiz AI
              </div>
              <p className="text-gray-400">
                Empowering small businesses with intelligent automation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Integrations</li>
                <li>Pricing</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Status</li>
                <li>Community</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AutoBiz AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 