import React, { useState, useMemo, useEffect } from 'react';
import { Mail, CreditCard, DollarSign, Clock, AlertTriangle, Home, BarChart3, CheckCircle, X, Pause, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'cleanslate:app:v1';

const defaultData = {
  user: { 
    name: 'Sarah Johnson', 
    email: 'sarah.johnson@email.com', 
    totalSaved: 247.80,
    joinDate: '2024-01-15'
  },
  subscriptions: [
    { id: 1, name: 'Netflix', amount: 15.99, status: 'active', lastUsed: '2 days ago', category: 'Entertainment', logo: '🎬' },
    { id: 2, name: 'Spotify Premium', amount: 9.99, status: 'active', lastUsed: '1 hour ago', category: 'Music', logo: '🎵' },
    { id: 3, name: 'Adobe Creative Cloud', amount: 52.99, status: 'unused', lastUsed: '3 months ago', category: 'Software', logo: '🎨' },
    { id: 4, name: 'Disney+', amount: 7.99, status: 'forgotten', lastUsed: '6 months ago', category: 'Entertainment', logo: '🏰' },
    { id: 5, name: 'LinkedIn Premium', amount: 29.99, status: 'unused', lastUsed: '2 months ago', category: 'Professional', logo: '💼' },
    { id: 6, name: 'Canva Pro', amount: 12.99, status: 'paused', lastUsed: '1 month ago', category: 'Design', logo: '🎯' },
  ],
  emails: [
    { id: 1, sender: 'TechCrunch', type: 'promotional', frequency: 'daily', unsubscribed: false, emailsPerWeek: 7, category: 'Tech News' },
    { id: 2, sender: 'Groupon', type: 'promotional', frequency: 'daily', unsubscribed: false, emailsPerWeek: 14, category: 'Deals' },
    { id: 3, sender: 'Amazon', type: 'promotional', frequency: 'weekly', unsubscribed: false, emailsPerWeek: 3, category: 'Shopping' },
    { id: 4, sender: 'Medium', type: 'newsletter', frequency: 'weekly', unsubscribed: true, emailsPerWeek: 2, category: 'Reading' },
    { id: 5, sender: 'Udemy', type: 'promotional', frequency: 'weekly', unsubscribed: false, emailsPerWeek: 5, category: 'Education' },
  ]
};

function loadFromStorage() {
  try {
    if (typeof window === 'undefined') return defaultData;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    return {
      ...defaultData,
      ...parsed,
      subscriptions: parsed.subscriptions || defaultData.subscriptions,
      emails: parsed.emails || defaultData.emails,
    };
  } catch (e) {
    console.warn('Failed to load storage', e);
    return defaultData;
  }
}

function saveToStorage(state) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (e) {
    console.warn('Failed to save', e);
  }
}

const StatCard = ({ title, value, icon: Icon, className = '', subtitle = '' }) => (
  <div className={`p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm opacity-90 font-medium">{title}</p>
        <p className="text-3xl font-bold mb-1">{value}</p>
        {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
      </div>
      <div className="ml-4">
        <Icon className="h-10 w-10 opacity-80" />
      </div>
    </div>
  </div>
);

const SubscriptionCard = ({ subscription, onCancel, onPause, onActivate }) => {
  const [isLoading, setIsLoading] = useState(false);

  const getStatusIcon = () => {
    switch (subscription.status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'unused': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'forgotten': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'paused': return <Pause className="h-5 w-5 text-blue-500" />;
      case 'cancelled': return <X className="h-5 w-5 text-gray-500" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (subscription.status) {
      case 'active': return 'border-green-200 bg-green-50';
      case 'unused': return 'border-yellow-200 bg-yellow-50';
      case 'forgotten': return 'border-red-200 bg-red-50';
      case 'paused': return 'border-blue-200 bg-blue-50';
      case 'cancelled': return 'border-gray-200 bg-gray-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const handleAction = async (action) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      switch (action) {
        case 'cancel': onCancel(subscription.id); break;
        case 'pause': onPause(subscription.id); break;
        case 'activate': onActivate(subscription.id); break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getStatusColor()}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{subscription.logo}</div>
          <div>
            <h4 className="font-semibold text-gray-900">{subscription.name}</h4>
            <p className="text-sm text-gray-600">{subscription.category}</p>
            <div className="flex items-center space-x-2 mt-1">
              {getStatusIcon()}
              <span className="text-sm capitalize text-gray-700">{subscription.status}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-bold text-lg text-gray-900">${subscription.amount}</p>
          <p className="text-xs text-gray-500">per month</p>
          <p className="text-xs text-gray-500 mt-1">Last used: {subscription.lastUsed}</p>
        </div>
      </div>
      
      {subscription.status !== 'cancelled' && (
        <div className="mt-4 flex space-x-2">
          {subscription.status === 'active' && (
            <button
              onClick={() => handleAction('pause')}
              disabled={isLoading}
              className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Pause'}
            </button>
          )}
          {subscription.status === 'paused' && (
            <button
              onClick={() => handleAction('activate')}
              disabled={isLoading}
              className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Reactivate'}
            </button>
          )}
          <button
            onClick={() => handleAction('cancel')}
            disabled={isLoading}
            className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {isLoading ? 'Cancelling...' : 'Cancel'}
          </button>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [data, setData] = useState(defaultData);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Load data on client side only
  useEffect(() => {
    const loadedData = loadFromStorage();
    setData(loadedData);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  const analytics = useMemo(() => {
    const totalSubscriptions = data.subscriptions.length;
    const activeSubscriptions = data.subscriptions.filter(s => s.status === 'active').length;
    const unusedSubscriptions = data.subscriptions.filter(s => s.status === 'unused').length;
    const forgottenSubscriptions = data.subscriptions.filter(s => s.status === 'forgotten').length;
    const pausedSubscriptions = data.subscriptions.filter(s => s.status === 'paused').length;
    const monthlySpend = data.subscriptions.reduce((sum, sub) => sum + (sub.status === 'cancelled' ? 0 : sub.amount), 0);
    const potentialSavings = data.subscriptions.filter(s => s.status !== 'active' && s.status !== 'cancelled').reduce((sum, sub) => sum + sub.amount, 0);
    const emailsPerWeek = data.emails.filter(e => !e.unsubscribed).reduce((sum, e) => sum + e.emailsPerWeek, 0);
    const timeWasted = Math.max(0, emailsPerWeek * 2); // 2 minutes per email on average
    
    return { 
      totalSubscriptions, 
      activeSubscriptions, 
      unusedSubscriptions, 
      forgottenSubscriptions,
      pausedSubscriptions,
      monthlySpend, 
      potentialSavings, 
      emailsPerWeek, 
      timeWasted 
    };
  }, [data.subscriptions, data.emails]);

  // Actions
  const cancelSubscription = (id) => setData(prev => ({
    ...prev,
    subscriptions: prev.subscriptions.map(s => s.id === id ? { ...s, status: 'cancelled' } : s)
  }));

  const pauseSubscription = (id) => setData(prev => ({
    ...prev,
    subscriptions: prev.subscriptions.map(s => s.id === id ? { ...s, status: 'paused' } : s)
  }));

  const activateSubscription = (id) => setData(prev => ({
    ...prev,
    subscriptions: prev.subscriptions.map(s => s.id === id ? { ...s, status: 'active' } : s)
  }));

  const unsubscribeEmail = (id) => setData(prev => ({
    ...prev,
    emails: prev.emails.map(e => e.id === id ? { ...e, unsubscribed: true } : e)
  }));

  const resubscribeEmail = (id) => setData(prev => ({
    ...prev,
    emails: prev.emails.map(e => e.id === id ? { ...e, unsubscribed: false } : e)
  }));

  // AI Integration
  const generateAIResponse = async (prompt, type = 'general') => {
    setLoading(true);
    setAiResult(null);
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type })
      });
      const json = await response.json();
      setAiResult(json.content || json.error || 'No response');
    } catch (e) {
      setAiResult('Request failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CleanSlate
              </div>
              <span className="text-sm text-gray-500 font-medium">Digital Life Decluttering</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-600">Welcome back, {data.user.name}</p>
                <p className="text-xs text-green-600 font-medium">💰 Total saved: ${data.user.totalSaved}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {data.user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
              { id: 'emails', label: 'Email Management', icon: Mail },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'border-blue-500 text-blue-600 bg-blue-50 px-3 rounded-t-lg' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Potential Monthly Savings" 
                value={`$${analytics.potentialSavings.toFixed(2)}`}
                subtitle="From unused subscriptions"
                icon={DollarSign} 
                className="bg-gradient-to-br from-green-500 to-green-600" 
              />
              <StatCard 
                title="Monthly Spend" 
                value={`$${analytics.monthlySpend.toFixed(2)}`}
                subtitle={`$${(analytics.monthlySpend * 12).toFixed(0)} annually`}
                icon={CreditCard} 
                className="bg-gradient-to-br from-blue-500 to-blue-600" 
              />
              <StatCard 
                title="Weekly Email Load" 
                value={analytics.emailsPerWeek}
                subtitle="Promotional emails"
                icon={Mail} 
                className="bg-gradient-to-br from-purple-500 to-purple-600" 
              />
              <StatCard 
                title="Time Wasted" 
                value={`${analytics.timeWasted}min`}
                subtitle="Per week on emails"
                icon={Clock} 
                className="bg-gradient-to-br from-orange-500 to-orange-600" 
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <AlertTriangle className="h-6 w-6 text-orange-500 mr-3" />
                  Priority Actions - High Impact
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Save up to ${analytics.potentialSavings.toFixed(2)}/month
                </span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.subscriptions
                  .filter(s => s.status === 'forgotten' || s.status === 'unused')
                  .slice(0, 4)
                  .map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl">{sub.logo}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{sub.name}</p>
                          <p className="text-sm text-gray-600">
                            {sub.status === 'forgotten' ? '🚨 Forgotten' : '⚠️ Unused'} • Last used: {sub.lastUsed}
                          </p>
                          <p className="text-sm font-medium text-green-700">Save ${sub.amount}/month</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => pauseSubscription(sub.id)}
                          className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm hover:bg-blue-200 transition-colors font-medium"
                        >
                          Pause
                        </button>
                        <button 
                          onClick={() => cancelSubscription(sub.id)}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors font-medium shadow-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* AI Assistant */}
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-blue-500 mr-2">🤖</span>
                AI Financial Assistant
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Get personalized recommendations for optimizing your subscriptions and reducing digital clutter.
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                <button 
                  onClick={() => generateAIResponse(`Analyze my subscriptions: ${JSON.stringify(data.subscriptions.map(s => ({name: s.name, amount: s.amount, status: s.status, lastUsed: s.lastUsed})))}. Give me 3 specific recommendations to save money.`, 'analysis')}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Get Savings Recommendations'}
                </button>
                <button 
                  onClick={() => generateAIResponse('Write a polite email template to pause a subscription temporarily due to budget constraints.', 'email')}
                  disabled={loading}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  Email Template
                </button>
                <button 
                  onClick={() => setAiResult(null)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Clear
                </button>
              </div>
              {aiResult && (
                <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">AI Recommendation:</h4>
                  <div className="text-gray-800 whitespace-pre-wrap">{aiResult}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Subscription Management
              </h2>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{analytics.activeSubscriptions}</p>
                  <p className="text-xs text-gray-600">Active</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{analytics.unusedSubscriptions}</p>
                  <p className="text-xs text-gray-600">Unused</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{analytics.forgottenSubscriptions}</p>
                  <p className="text-xs text-gray-600">Forgotten</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{analytics.pausedSubscriptions}</p>
                  <p className="text-xs text-gray-600">Paused</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">${analytics.potentialSavings.toFixed(0)}</p>
                  <p className="text-xs text-gray-600">Potential Savings</p>
                </div>
              </div>
            </div>

            {/* Subscription Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.subscriptions.map(subscription => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onCancel={cancelSubscription}
                  onPause={pauseSubscription}
                  onActivate={activateSubscription}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'emails' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Management</h2>
              
              {/* Email Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800">Weekly Email Volume</h4>
                  <p className="text-2xl font-bold text-red-600">{analytics.emailsPerWeek}</p>
                  <p className="text-sm text-red-600">promotional emails</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800">Cleaned Up</h4>
                  <p className="text-2xl font-bold text-green-600">{data.emails.filter(e => e.unsubscribed).length}</p>
                  <p className="text-sm text-green-600">unsubscribed senders</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800">Time Saved</h4>
                  <p className="text-2xl font-bold text-blue-600">{Math.round(data.emails.filter(e => e.unsubscribed).length * 10)}</p>
                  <p className="text-sm text-blue-600">minutes per week</p>
                </div>
              </div>

              {/* Email List */}
              <div className="space-y-4">
                {data.emails.map(email => (
                  <div key={email.id} className={`p-4 rounded-lg border transition-all ${
                    email.unsubscribed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-gray-900">{email.sender}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            email.type === 'promotional' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {email.type}
                          </span>
                          <span className="text-sm text-gray-500">{email.category}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {email.emailsPerWeek} emails/week • {email.frequency} frequency
                        </p>
                        {email.unsubscribed && (
                          <p className="text-sm text-green-600 font-medium mt-1">✓ Unsubscribed</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {email.unsubscribed ? (
                          <button
                            onClick={() => resubscribeEmail(email.id)}
                            className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                          >
                            Resubscribe
                          </button>
                        ) : (
                          <button
                            onClick={() => unsubscribeEmail(email.id)}
                            className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                          >
                            Unsubscribe
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in">
            {/* Analytics Header */}
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced Analytics</h2>
              <p className="text-gray-600">Detailed insights into your digital spending and optimization opportunities.</p>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Optimization Score */}
              <div className="bg-white rounded-xl shadow-lg border p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="text-green-500 mr-2">📊</span>
                  Optimization Score
                </h3>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {Math.round(((analytics.activeSubscriptions / analytics.totalSubscriptions) * 100))}%
                  </div>
                  <p className="text-gray-600">Subscription Efficiency</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active subscriptions</span>
                    <span className="font-semibold text-green-600">{analytics.activeSubscriptions}/{analytics.totalSubscriptions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly savings opportunity</span>
                    <span className="font-semibold text-orange-600">${analytics.potentialSavings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email cleanup progress</span>
                    <span className="font-semibold text-purple-600">
                      {Math.round((data.emails.filter(e => e.unsubscribed).length / data.emails.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-white rounded-xl shadow-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
                <div className="space-y-4">
                  {Object.entries(
                    data.subscriptions
                      .filter(s => s.status !== 'cancelled')
                      .reduce((acc, sub) => {
                        acc[sub.category] = (acc[sub.category] || 0) + sub.amount;
                        return acc;
                      }, {})
                  )
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, amount], index) => {
                      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full`} style={{backgroundColor: colors[index % colors.length]}}></div>
                            <span className="font-medium">{category}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${amount.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">{((amount / analytics.monthlySpend) * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Yearly Projection */}
              <div className="bg-white rounded-xl shadow-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Yearly Projection</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Current Path</h4>
                    <p className="text-2xl font-bold text-red-600">${(analytics.monthlySpend * 12).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Annual subscription cost</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Optimized Path</h4>
                    <p className="text-2xl font-bold text-green-600">
                      ${((analytics.monthlySpend - analytics.potentialSavings) * 12).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">With recommended changes</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800 font-semibold">
                      💰 Potential Annual Savings: ${(analytics.potentialSavings * 12).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="bg-white rounded-xl shadow-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Summary Overview</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Total Subscriptions</h4>
                    <p className="text-2xl font-bold text-blue-600">{analytics.totalSubscriptions}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800">Monthly Efficiency</h4>
                    <p className="text-lg font-bold text-green-600">
                      {analytics.activeSubscriptions} active / {analytics.totalSubscriptions} total
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800">Time Saved Weekly</h4>
                    <p className="text-lg font-bold text-purple-600">
                      {Math.round(data.emails.filter(e => e.unsubscribed).length * 10)} minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
