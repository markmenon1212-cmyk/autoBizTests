'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { 
  Bot, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Save, 
  Play,
  Mail,
  MessageSquare,
  ShoppingCart,
  Globe,
  Settings,
  Zap
} from 'lucide-react'
import toast from 'react-hot-toast'

interface WorkflowStep {
  id: string
  type: 'trigger' | 'action' | 'condition'
  name: string
  description: string
  config: Record<string, any>
  icon: React.ReactNode
}

interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  status: 'draft' | 'active' | 'paused'
}

export default function WorkflowBuilderPage() {
  const { isSignedIn, isLoaded } = useUser()
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>({
    id: '1',
    name: 'Email Marketing Automation',
    description: 'Automated email campaigns based on user behavior',
    status: 'draft',
    steps: []
  })

  const [isAddingStep, setIsAddingStep] = useState(false)
  const [selectedStepType, setSelectedStepType] = useState<'trigger' | 'action' | 'condition'>('trigger')

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isSignedIn) {
    redirect('/')
  }

  const stepTemplates = {
    trigger: [
      {
        name: 'New Email Received',
        description: 'Trigger when a new email is received',
        icon: <Mail className="w-5 h-5" />,
        config: { emailProvider: 'gmail', folder: 'inbox' }
      },
      {
        name: 'Social Media Mention',
        description: 'Trigger when your brand is mentioned on social media',
        icon: <MessageSquare className="w-5 h-5" />,
        config: { platforms: ['twitter', 'instagram'], keywords: [] }
      },
      {
        name: 'E-commerce Order',
        description: 'Trigger when a new order is placed',
        icon: <ShoppingCart className="w-5 h-5" />,
        config: { platform: 'shopify', orderStatus: 'paid' }
      }
    ],
    action: [
      {
        name: 'Send Email',
        description: 'Send an automated email response',
        icon: <Mail className="w-5 h-5" />,
        config: { template: '', recipients: [], subject: '' }
      },
      {
        name: 'Post to Social Media',
        description: 'Automatically post content to social platforms',
        icon: <MessageSquare className="w-5 h-5" />,
        config: { platforms: [], content: '', schedule: 'immediate' }
      },
      {
        name: 'Update Inventory',
        description: 'Update product inventory across platforms',
        icon: <ShoppingCart className="w-5 h-5" />,
        config: { platforms: [], products: [], action: 'decrease' }
      }
    ],
    condition: [
      {
        name: 'Check Email Content',
        description: 'Check if email contains specific keywords',
        icon: <Mail className="w-5 h-5" />,
        config: { keywords: [], operator: 'contains' }
      },
      {
        name: 'Check Customer Value',
        description: 'Check if customer meets certain criteria',
        icon: <Globe className="w-5 h-5" />,
        config: { criteria: 'order_value', operator: 'greater_than', value: 0 }
      }
    ]
  }

  const addStep = (template: any) => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      type: selectedStepType,
      name: template.name,
      description: template.description,
      config: template.config,
      icon: template.icon
    }

    setCurrentWorkflow({
      ...currentWorkflow,
      steps: [...currentWorkflow.steps, newStep]
    })
    setIsAddingStep(false)
    toast.success('Step added to workflow!')
  }

  const removeStep = (stepId: string) => {
    setCurrentWorkflow({
      ...currentWorkflow,
      steps: currentWorkflow.steps.filter(step => step.id !== stepId)
    })
    toast.success('Step removed from workflow!')
  }

  const saveWorkflow = () => {
    if (!currentWorkflow.name || currentWorkflow.steps.length === 0) {
      toast.error('Please add a name and at least one step to your workflow')
      return
    }
    toast.success('Workflow saved successfully!')
  }

  const activateWorkflow = () => {
    if (currentWorkflow.steps.length === 0) {
      toast.error('Please add at least one step to your workflow')
      return
    }
    setCurrentWorkflow({ ...currentWorkflow, status: 'active' })
    toast.success('Workflow activated!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bot className="w-8 h-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Workflow Builder</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Demo Mode
              </div>
              <button onClick={saveWorkflow} className="btn-secondary flex items-center">
                <Save className="w-5 h-5 mr-2" />
                Save Draft
              </button>
              <button onClick={activateWorkflow} className="btn-primary flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Activate Workflow
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Workflow Canvas */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Workflow Canvas</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workflow Name
                    </label>
                    <input
                      type="text"
                      value={currentWorkflow.name}
                      onChange={(e) => setCurrentWorkflow({...currentWorkflow, name: e.target.value})}
                      className="input-field"
                      placeholder="Enter workflow name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      currentWorkflow.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {currentWorkflow.status}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={currentWorkflow.description}
                    onChange={(e) => setCurrentWorkflow({...currentWorkflow, description: e.target.value})}
                    className="input-field"
                    rows={3}
                    placeholder="Describe what this workflow does..."
                  />
                </div>
              </div>

              {/* Workflow Steps */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Workflow Steps</h3>
                
                {currentWorkflow.steps.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No steps added yet</p>
                    <button 
                      onClick={() => setIsAddingStep(true)}
                      className="btn-primary flex items-center mx-auto"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add First Step
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentWorkflow.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{step.name}</h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                            step.type === 'trigger' ? 'bg-blue-100 text-blue-800' :
                            step.type === 'action' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {step.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeStep(step.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          {index < currentWorkflow.steps.length - 1 && (
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => setIsAddingStep(true)}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors"
                    >
                      <Plus className="w-5 h-5 mx-auto mb-2" />
                      Add Next Step
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step Library */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step Library</h3>
              
              {!isAddingStep ? (
                <button 
                  onClick={() => setIsAddingStep(true)}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Step
                </button>
              ) : (
                <div className="space-y-4">
                  {/* Step Type Selector */}
                  <div className="flex space-x-2 mb-4">
                    {(['trigger', 'action', 'condition'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedStepType(type)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          selectedStepType === type
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Step Templates */}
                  <div className="space-y-3">
                    {stepTemplates[selectedStepType].map((template, index) => (
                      <div
                        key={index}
                        onClick={() => addStep(template)}
                        className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            {template.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{template.name}</h4>
                            <p className="text-sm text-gray-600">{template.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setIsAddingStep(false)}
                    className="w-full btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Workflow Stats */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Steps:</span>
                  <span className="font-semibold">{currentWorkflow.steps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Triggers:</span>
                  <span className="font-semibold">
                    {currentWorkflow.steps.filter(s => s.type === 'trigger').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Actions:</span>
                  <span className="font-semibold">
                    {currentWorkflow.steps.filter(s => s.type === 'action').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conditions:</span>
                  <span className="font-semibold">
                    {currentWorkflow.steps.filter(s => s.type === 'condition').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 