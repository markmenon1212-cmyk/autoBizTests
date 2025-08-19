'use client'

import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import { 
  Bot, 
  Settings, 
  BarChart3, 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Trash2,
  MessageSquare,
  Mail,
  ShoppingCart,
  Globe
} from 'lucide-react'
import toast from 'react-hot-toast'
import AIWorkflowExecutor from '../components/AIWorkflowExecutor'
import DemoData from '../components/DemoData'
import SubscriptionStatus from '../components/SubscriptionStatus'

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'draft'
  type: 'email' | 'social' | 'ecommerce' | 'seo'
  createdAt: string
  lastRun?: string
}

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useUser()
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Email Newsletter Automation',
      description: 'Automatically send personalized newsletters to subscribers',
      status: 'active',
      type: 'email',
      createdAt: '2024-01-15',
      lastRun: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      name: 'Social Media Content Scheduler',
      description: 'Schedule and post content across all social platforms',
      status: 'paused',
      type: 'social',
      createdAt: '2024-01-10',
      lastRun: '2024-01-19T15:45:00Z'
    },
    {
      id: '3',
      name: 'E-commerce Inventory Sync',
      description: 'Sync inventory across Shopify and WooCommerce',
      status: 'active',
      type: 'ecommerce',
      createdAt: '2024-01-05',
      lastRun: '2024-01-20T09:15:00Z'
    }
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    type: 'email' as Workflow['type']
  })

  // Create user in database when they sign in
  useEffect(() => {
    if (isSignedIn && user) {
      createUserIfNeeded()
    }
  }, [isSignedIn, user])

  const createUserIfNeeded = async () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) return
    
    try {
      console.log('🔄 Creating user in database:', user.emailAddresses[0].emailAddress)
      
      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.emailAddresses[0].emailAddress,
          name: user.fullName || user.firstName || 'User',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ User created/updated in database:', data.user)
      } else {
        console.error('❌ Failed to create user in database')
      }
    } catch (error) {
      console.error('❌ Error creating user in database:', error)
    }
  }

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  // For demo purposes, allow access without authentication
  // In production, you would want to keep the redirect
  // if (!isSignedIn) {
  //   redirect('/')
  // }

  const handleCreateWorkflow = () => {
    if (!newWorkflow.name || !newWorkflow.description) {
      toast.error('Please fill in all fields')
      return
    }

    const workflow: Workflow = {
      id: Date.now().toString(),
      name: newWorkflow.name,
      description: newWorkflow.description,
      status: 'draft',
      type: newWorkflow.type,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setWorkflows([...workflows, workflow])
    setNewWorkflow({ name: '', description: '', type: 'email' })
    setIsCreating(false)
    toast.success('Workflow created successfully!')
  }

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(workflows.map(w => 
      w.id === id 
        ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
        : w
    ))
    toast.success('Workflow status updated!')
  }

  const deleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter(w => w.id !== id))
    toast.success('Workflow deleted!')
  }

  const getTypeIcon = (type: Workflow['type']) => {
    switch (type) {
      case 'email': return <Mail className="w-5 h-5" />
      case 'social': return <MessageSquare className="w-5 h-5" />
      case 'ecommerce': return <ShoppingCart className="w-5 h-5" />
      case 'seo': return <Globe className="w-5 h-5" />
      default: return <Bot className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: Workflow['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bot className="w-8 h-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">AutoBiz AI Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Demo Mode
              </div>
              <button className="btn-secondary">
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </button>
              {isSignedIn ? (
                <UserButton />
              ) : (
                <a href="/" className="btn-primary">
                  Sign In
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <Zap className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Workflows</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workflows.filter(w => w.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Messages Sent</p>
                <p className="text-2xl font-bold text-gray-900">5,892</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">AI Tasks</p>
                <p className="text-2xl font-bold text-gray-900">892</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        {isSignedIn && (
          <div className="mb-8">
            <SubscriptionStatus />
          </div>
        )}

        {/* Workflows Section */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">AI Workflows</h2>
            <button 
              onClick={() => setIsCreating(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Workflow
            </button>
          </div>

          {/* Create Workflow Modal */}
          {isCreating && (
            <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Create New Workflow</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workflow Name
                  </label>
                  <input
                    type="text"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                    className="input-field"
                    placeholder="Enter workflow name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={newWorkflow.type}
                    onChange={(e) => setNewWorkflow({...newWorkflow, type: e.target.value as Workflow['type']})}
                    className="input-field"
                  >
                    <option value="email">Email Automation</option>
                    <option value="social">Social Media</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="seo">SEO & Content</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Describe what this workflow does..."
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleCreateWorkflow} className="btn-primary">
                  Create Workflow
                </button>
                <button onClick={() => setIsCreating(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Workflows List */}
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    {getTypeIcon(workflow.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                    <p className="text-sm text-gray-600">{workflow.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workflow.status)}`}>
                        {workflow.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        Created: {workflow.createdAt}
                      </span>
                      {workflow.lastRun && (
                        <span className="text-xs text-gray-500">
                          Last run: {new Date(workflow.lastRun).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleWorkflowStatus(workflow.id)}
                    className={`p-2 rounded-lg ${
                      workflow.status === 'active' 
                        ? 'text-yellow-600 hover:bg-yellow-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {workflow.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => deleteWorkflow(workflow.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Data */}
        <div className="mt-8">
          <DemoData />
        </div>

        {/* AI Workflow Executor */}
        <div className="mt-8">
          <AIWorkflowExecutor />
        </div>
      </div>
    </div>
  )
} 