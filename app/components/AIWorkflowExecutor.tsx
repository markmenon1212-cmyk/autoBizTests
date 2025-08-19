'use client'

import { useState } from 'react'
import { Bot, Send, Loader2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

interface WorkflowExecution {
  id: string
  input: string
  response: string
  type: 'email' | 'social' | 'ecommerce' | 'seo'
  timestamp: string
  status: 'pending' | 'completed' | 'error'
}

export default function AIWorkflowExecutor() {
  const [input, setInput] = useState('')
  const [workflowType, setWorkflowType] = useState<'email' | 'social' | 'ecommerce' | 'seo'>('email')
  const [customContext, setCustomContext] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])

  const workflowTemplates = {
    email: {
      placeholder: 'Describe the email you want to send (e.g., "Welcome email for new customers", "University acceptance letter", "Meeting invitation")',
      context: 'Create professional emails for any business or personal purpose'
    },
    social: {
      placeholder: 'Describe the social media post you want to create (e.g., "Product announcement", "Company update", "Event promotion")',
      context: 'Create engaging social media content for any platform or business'
    },
    ecommerce: {
      placeholder: 'Describe the e-commerce task (e.g., "Product description", "Category page content", "Marketing copy")',
      context: 'Generate e-commerce content for any type of business or product'
    },
    seo: {
      placeholder: 'Describe the SEO content you need (e.g., "Blog post about sustainability", "Product page optimization", "Industry insights")',
      context: 'Create SEO-optimized content for any topic or industry'
    }
  }

  const executeWorkflow = async () => {
    if (!input.trim()) {
      toast.error('Please enter some input')
      return
    }

    setIsExecuting(true)
    const executionId = Date.now().toString()

    // Add pending execution
    const pendingExecution: WorkflowExecution = {
      id: executionId,
      input,
      response: '',
      type: workflowType,
      timestamp: new Date().toISOString(),
      status: 'pending'
    }

    setExecutions(prev => [pendingExecution, ...prev])

    try {
      const response = await fetch('/api/ai-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow: {
            id: executionId,
            type: workflowType
          },
          input: input,
          context: customContext || workflowTemplates[workflowType].context
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to execute workflow')
      }

      const data = await response.json()

      // Update execution with response
      setExecutions(prev => prev.map(exec => 
        exec.id === executionId 
          ? { ...exec, response: data.response, status: 'completed' as const }
          : exec
      ))

      toast.success('Workflow executed successfully!')
      setInput('')
    } catch (error) {
      console.error('Workflow execution error:', error)
      
      // Update execution with error
      setExecutions(prev => prev.map(exec => 
        exec.id === executionId 
          ? { ...exec, response: 'Error: Failed to execute workflow', status: 'error' as const }
          : exec
      ))

      toast.error('Failed to execute workflow')
    } finally {
      setIsExecuting(false)
    }
  }

  const getTypeIcon = (type: WorkflowExecution['type']) => {
    switch (type) {
      case 'email': return '📧'
      case 'social': return '📱'
      case 'ecommerce': return '🛒'
      case 'seo': return '🔍'
      default: return '🤖'
    }
  }

  const getStatusColor = (status: WorkflowExecution['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'pending': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Workflow Input */}
      <div className="card mb-8">
        <div className="flex items-center mb-6">
          <Bot className="w-8 h-8 text-primary-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">AI Workflow Executor</h2>
        </div>

        <div className="space-y-4">
          {/* Workflow Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workflow Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['email', 'social', 'ecommerce', 'seo'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setWorkflowType(type)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    workflowType === type
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{getTypeIcon(type)}</div>
                  <div className="text-sm font-medium capitalize">{type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Input Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe what you want to automate
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={workflowTemplates[workflowType].placeholder}
              className="input-field"
              rows={4}
            />
          </div>

          {/* Context Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Context (Optional)
            </label>
            <textarea
              placeholder="Describe your business context, industry, or specific requirements (e.g., 'University admissions office', 'Tech startup', 'Restaurant business')"
              className="input-field"
              rows={2}
              onChange={(e) => setCustomContext(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to use default context, or customize for your specific needs
            </p>
          </div>

          {/* Execute Button */}
          <button
            onClick={executeWorkflow}
            disabled={isExecuting || !input.trim()}
            className="btn-primary w-full flex items-center justify-center py-3"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Executing Workflow...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Execute AI Workflow
              </>
            )}
          </button>
        </div>
      </div>

      {/* Execution History */}
      {executions.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Executions</h3>
          
          <div className="space-y-4">
            {executions.map((execution) => (
              <div key={execution.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(execution.type)}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {execution.type} Workflow
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(execution.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${getStatusColor(execution.status)}`}>
                    {execution.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Input:</h5>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {execution.input}
                    </p>
                  </div>

                  {execution.response && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">AI Response:</h5>
                      <div className="text-sm text-gray-900 bg-primary-50 p-3 rounded border-l-4 border-primary-500">
                        {execution.status === 'pending' ? (
                          <div className="flex items-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Processing...
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap">{execution.response}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 