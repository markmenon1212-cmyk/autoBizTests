'use client'

import { useState } from 'react'
import { Bot, Zap, TrendingUp, Users, DollarSign } from 'lucide-react'

export default function DemoData() {
  const [activeTab, setActiveTab] = useState<'overview' | 'workflows' | 'analytics'>('overview')

  const demoStats = [
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'Active Workflows',
      value: '12',
      change: '+3 this week',
      color: 'text-blue-600'
    },
    {
      icon: <Bot className="w-6 h-6" />,
      label: 'AI Tasks Completed',
      value: '1,247',
      change: '+156 today',
      color: 'text-green-600'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Revenue Generated',
      value: '$12,450',
      change: '+23% this month',
      color: 'text-purple-600'
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Customers Reached',
      value: '8,923',
      change: '+1,234 this week',
      color: 'text-orange-600'
    }
  ]

  const sampleWorkflows = [
    {
      id: '1',
      name: 'Welcome Email Sequence',
      type: 'email',
      status: 'active',
      lastRun: '2 hours ago',
      successRate: '98%',
      description: 'Automated welcome emails for new customers'
    },
    {
      id: '2',
      name: 'Social Media Scheduler',
      type: 'social',
      status: 'active',
      lastRun: '1 hour ago',
      successRate: '95%',
      description: 'Automated posting across all social platforms'
    },
    {
      id: '3',
      name: 'Inventory Sync',
      type: 'ecommerce',
      status: 'active',
      lastRun: '30 minutes ago',
      successRate: '99%',
      description: 'Sync inventory between Shopify and WooCommerce'
    },
    {
      id: '4',
      name: 'Review Response',
      type: 'seo',
      status: 'paused',
      lastRun: '1 day ago',
      successRate: '92%',
      description: 'Automated responses to customer reviews'
    }
  ]

  const analyticsData = [
    { month: 'Jan', workflows: 8, tasks: 450, revenue: 8500 },
    { month: 'Feb', workflows: 10, tasks: 520, revenue: 9200 },
    { month: 'Mar', workflows: 12, tasks: 680, revenue: 10800 },
    { month: 'Apr', workflows: 15, tasks: 890, revenue: 12450 },
    { month: 'May', workflows: 18, tasks: 1120, revenue: 15800 },
    { month: 'Jun', workflows: 22, tasks: 1340, revenue: 18900 }
  ]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Demo Dashboard</h2>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Live Demo Data
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {(['overview', 'workflows', 'analytics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {demoStats.map((stat, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color.replace('text-', 'bg-')} bg-opacity-10`}>
                    <div className={stat.color}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Welcome email sent to 45 new customers</span>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Social media posts scheduled for next week</span>
                <span className="text-xs text-gray-500">15 min ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Inventory updated across all platforms</span>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'workflows' && (
        <div className="space-y-4">
          {sampleWorkflows.map((workflow) => (
            <div key={workflow.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">
                    {workflow.type === 'email' ? '📧' : 
                     workflow.type === 'social' ? '📱' : 
                     workflow.type === 'ecommerce' ? '🛒' : '🔍'}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{workflow.name}</h4>
                  <p className="text-sm text-gray-600">{workflow.description}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {workflow.status}
                    </span>
                    <span className="text-xs text-gray-500">Last run: {workflow.lastRun}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{workflow.successRate}</p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h4>
              <p className="text-2xl font-bold text-gray-900">$124,500</p>
              <p className="text-sm text-green-600">+23% vs last month</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Tasks Completed</h4>
              <p className="text-2xl font-bold text-gray-900">12,450</p>
              <p className="text-sm text-green-600">+15% vs last month</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Active Workflows</h4>
              <p className="text-2xl font-bold text-gray-900">22</p>
              <p className="text-sm text-green-600">+4 this month</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-4">Monthly Growth</h4>
            <div className="grid grid-cols-6 gap-4">
              {analyticsData.map((data, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{data.month}</div>
                  <div className="text-lg font-semibold text-gray-900">${(data.revenue / 1000).toFixed(0)}k</div>
                  <div className="text-xs text-gray-500">{data.tasks} tasks</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 