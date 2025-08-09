// pages/index.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Mail, 
  CreditCard, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  Home as HomeIcon, // Renamed to avoid conflict
  BarChart3, 
  CheckCircle, 
  X, 
  Pause, 
  Trash2, 
  TrendingUp, 
  Zap, 
  Target, 
  Calendar, 
  Search, 
  Eye, 
  EyeOff 
} from 'lucide-react';

const defaultData = {
  user: { 
    name: 'Sarah Johnson', 
    email: 'sarah.johnson@email.com', 
    totalSaved: 247.80,
    joinDate: '2024-01-15',
    savingsGoal: 300
  },
  subscriptions: [
    { id: 1, name: 'Netflix', amount: 15.99, status: 'active', lastUsed: '2 days ago', category: 'Entertainment', logo: '🎬', nextBilling: '2025-08-15', yearlyDiscount: 0 },
    { id: 2, name: 'Spotify Premium', amount: 9.99, status: 'active', lastUsed: '1 hour ago', category: 'Music', logo: '🎵', nextBilling: '2025-08-12', yearlyDiscount: 20 },
    { id: 3, name: 'Adobe Creative Cloud', amount: 52.99, status: 'unused', lastUsed: '3 months ago', category: 'Software', logo: '🎨', nextBilling: '2025-08-20', yearlyDiscount: 16 },
    { id: 4, name: 'Disney+', amount: 7.99, status: 'forgotten', lastUsed: '6 months ago', category: 'Entertainment', logo: '🏰', nextBilling: '2025-08-18', yearlyDiscount: 0 },
    { id: 5, name: 'LinkedIn Premium', amount: 29.99, status: 'unused', lastUsed: '2 months ago', category: 'Professional', logo: '💼', nextBilling: '2025-08-25', yearlyDiscount: 25 },
    { id: 6, name: 'Canva Pro', amount: 12.99, status: 'paused', lastUsed: '1 month ago', category: 'Design', logo: '🎯', nextBilling: 'Paused', yearlyDiscount: 10 },
    { id: 7, name: 'GitHub Pro', amount: 4.00, status: 'active', lastUsed: 'Today', category: 'Development', logo: '💻', nextBilling: '2025-08-11', yearlyDiscount: 16 },
    { id: 8, name: 'Notion Pro', amount: 8.00, status: 'active', lastUsed: 'Yesterday', category: 'Productivity', logo: '📝', nextBilling: '2025-08-14', yearlyDiscount: 20 }
  ],
  emails: [
    { id: 1, sender: 'TechCrunch', type: 'promotional', frequency: 'daily', unsubscribed: false, emailsPerWeek: 7, category: 'Tech News', importance: 'low' },
    { id: 2, sender: 'Groupon', type: 'promotional', frequency: 'daily', unsubscribed: false, emailsPerWeek: 14, category: 'Deals', importance: 'low' },
    { id: 3, sender: 'Amazon', type: 'promotional', frequency: 'weekly', unsubscribed: false, emailsPerWeek: 3, category: 'Shopping', importance: 'medium' },
    { id: 4, sender: 'Medium', type: 'newsletter', frequency: 'weekly', unsubscribed: true, emailsPerWeek: 2, category: 'Reading', importance: 'high' },
    { id: 5, sender: 'Udemy', type: 'promotional', frequency: 'weekly', unsubscribed: false, emailsPerWeek: 5, category: 'Education', importance: 'medium' },
    { id: 6, sender: 'LinkedIn', type: 'notification', frequency: 'daily', unsubscribed: false, emailsPerWeek: 10, category: 'Professional', importance: 'high' },
  ],
  insights: [
    { id: 1, type: 'warning', title: 'Unused Adobe Creative Cloud', message: 'You haven\'t used Adobe CC in 3 months. Consider pausing to save $52.99/month.', impact: 52.99 },
    { id: 2, type: 'tip', title: 'Annual Billing Savings', message: 'Switch LinkedIn Premium to annual billing to save 25% ($89.97/year).', impact: 89.97 },
    { id: 3, type: 'success', title: 'Great Progress!', message: 'You\'ve already saved $247.80 this year. You\'re 83% to your $300 goal!', impact: 0 }
  ]
};

// Simple in-memory storage
let appState = { ...defaultData };

const StatCard = ({ title, value, icon: Icon, className = '', subtitle = '', trend = null, onClick = null }) => (
  <div 
    className={`p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer backdrop-blur-sm ${className}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm opacity-90 font-medium">{title}</p>
        <div className="flex items-baseline space-x-2">
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <span className={`text-sm flex items-center ${trend > 0 ? 'text-green-200' : 'text-red-200'}`}>
              <TrendingUp className={`h-3 w-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs opacity-80 mt-1">{subtitle}</p>}
      </div>
      <div className="ml-4">
        <Icon className="h-12 w-12 opacity-80" />
      </div>
    </div>
  </div>
);

const SubscriptionCard = ({ subscription, onCancel, onPause, onActivate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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
      case 'active': return 'border-green-200 bg-gradient-to-br from-green-50 to-green-100';
      case 'unused': return 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-100';
      case 'forgotten': return 'border-red-200 bg-gradient-to-br from-red-50 to-red-100';
      case 'paused': return 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'cancelled': return 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100';
      default: return 'border-gray-200 bg-white';
    }
  };

  const handleAction = async (action) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
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
    <div className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-3xl bg-white p-2 rounded-xl shadow-sm">{subscription.logo}</div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg">{subscription.name}</h4>
            <p className="text-sm text-gray-600 font-medium">{subscription.category}</p>
            <div className="flex items-center space-x-2 mt-2">
              {getStatusIcon()}
              <span className="text-sm capitalize text-gray-700 font-medium">{subscription.status}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-bold text-2xl text-gray-900">${subscription.amount}</p>
          <p className="text-xs text-gray-500 font-medium">per month</p>
          {subscription.yearlyDiscount > 0 && (
            <p className="text-xs text-green-600 font-medium">Save {subscription.yearlyDiscount}% yearly</p>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Last used:</span>
          <span className="font-medium">{subscription.lastUsed}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Next billing:</span>
          <span className="font-medium">{subscription.nextBilling}</span>
        </div>
        {showDetails && (
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Annual cost:</span>
              <span className="font-medium">${(subscription.amount * 12).toFixed(2)}</span>
            </div>
            {subscription.yearlyDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Yearly savings:</span>
                <span className="font-medium text-green-600">${(subscription.amount * 12 * subscription.yearlyDiscount / 100).toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
        >
          {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span>{showDetails ? 'Less details' : 'More details'}</span>
        </button>
        
        {subscription.status !== 'cancelled' && (
          <div className="flex space-x-2">
            {subscription.status === 'active' && (
              <button
                onClick={() => handleAction('pause')}
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium shadow-sm"
              >
                {isLoading ? 'Processing...' : 'Pause'}
              </button>
            )}
            {subscription.status === 'paused' && (
              <button
                onClick={() => handleAction('activate')}
                disabled={isLoading}
                className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors disabled:opacity-50 font-medium shadow-sm"
              >
                {isLoading ? 'Processing...' : 'Reactivate'}
              </button>
            )}
            <button
              onClick={() => handleAction('cancel')}
              disabled={isLoading}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center space-x-1 font-medium shadow-sm"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isLoading ? 'Cancelling...' : 'Cancel'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const InsightCard = ({ insight, onDismiss }) => {
  const getInsightIcon = () => {
    switch (insight.type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'tip': return <Zap className="h-5 w-5 text-blue-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Target className="h-5 w-5 text-gray-500" />;
    }
  };

  const getInsightColor = () => {
    switch (insight.type) {
      case 'warning': return 'border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50';
      case 'tip': return 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50';
      case 'success': return 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50';
      default: return 'border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100';
    }
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${getInsightColor()} transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {getInsightIcon()}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
            <p className="text-sm text-gray-700">{insight.message}</p>
            {insight.impact > 0 && (
              <p className="text-sm font-medium text-green-600 mt-2">
                💰 Potential savings: ${insight.impact.toFixed(2)}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onDismiss(insight.id)}
          className="text-gray-400 hover:text-gray-600 ml-2"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default function CleanSlateApp() { // Renamed from Home to CleanSlateApp
  const [data, setData] = useState(appState);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('amount');

  // Update app state when data changes
  useEffect(() => {
    appState = { ...data };
  }, [data]);

  const analytics = useMemo(() => {
    const totalSubscriptions = data.subscriptions.length;
    const activeSubscriptions = data.subscriptions.filter(s => s.status === 'active').length;
    const unusedSubscriptions = data.subscriptions.filter(s => s.status === 'unused').length;
    const forgottenSubscriptions = data.subscriptions.filter(s => s.status === 'forgotten').length;
    const pausedSubscriptions = data.subscriptions.filter(s => s.status === 'paused').length;
    const cancelledSubscriptions = data.subscriptions.filter(s => s.status === 'cancelled').length;
    const monthlySpend = data.subscriptions.reduce((sum, sub) => sum + (sub.status === 'cancelled' ? 0 : sub.amount), 0);
    const potentialSavings = data.subscriptions.filter(s => s.status !== 'active' && s.status !== 'cancelled').reduce((sum, sub) => sum + sub.amount, 0);
    const yearlyDiscount = data.subscriptions.filter(s => s.status !== 'cancelled').reduce((sum, sub) => sum + (sub.amount * 12 * sub.yearlyDiscount / 100), 0);
    const emailsPerWeek = data.emails.filter(e => !e.unsubscribed).reduce((sum, e) => sum + e.emailsPerWeek, 0);
    const timeWasted = Math.max(0, emailsPerWeek * 2);
    const progressToGoal = Math.min(100, (data.user.totalSaved / data.user.savingsGoal) * 100);
    
    return { 
      totalSubscriptions, 
      activeSubscriptions, 
      unusedSubscriptions, 
      forgottenSubscriptions,
      pausedSubscriptions,
      cancelledSubscriptions,
      monthlySpend, 
      potentialSavings,
      yearlyDiscount,
      emailsPerWeek, 
      timeWasted,
      progressToGoal
    };
  }, [data.subscriptions, data.emails, data.user]);

  // Filtered and sorted subscriptions
  const filteredSubscriptions = useMemo(() => {
    let filtered = data.subscriptions.filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sub.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount': return b.amount - a.amount;
        case 'name': return a.name.localeCompare(b.name);
        case 'status': return a.status.localeCompare(b.status);
        case 'category': return a.category.localeCompare(b.category);
        default: return 0;
      }
    });
  }, [data.subscriptions, searchTerm, filterStatus, sortBy]);

  // Actions
  const cancelSubscription = (id) => setData(prev => ({
    ...prev,
    subscriptions: prev.subscriptions.map(s => s.id === id ? { ...s, status: 'cancelled' } : s),
    user: { ...prev.user, totalSaved: prev.user.totalSaved + prev.subscriptions.find(s => s.id === id).amount }
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

  const dismissInsight = (id) => setData(prev => ({
    ...prev,
    insights: prev.insights.filter(i => i.id !== id)
  }));

  // Mock AI Integration
  const generateAIResponse = async (prompt, type = 'general') => {
    setLoading(true);
    setAiResult(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const responses = {
        analysis: `Based on your subscription analysis, here are my top 3 recommendations:

1. **Cancel Adobe Creative Cloud** - You haven't used it in 3 months, saving $52.99/month ($635.88/year)
2. **Switch to Annual Billing** - LinkedIn Premium offers 25% savings annually, saving $89.97/year
3. **Review Disney+** - Last used 6 months ago, consider sharing with family or canceling to save $7.99/month

**Total potential savings: $60.98/month or $731.76/year**`,
        
        email: `Subject: Request to Pause My Subscription

Dear [Service Name] Team,

I hope this email finds you well. I am writing to request a temporary pause on my subscription due to current budget constraints.

I have been a satisfied customer and would like to maintain my account rather than canceling permanently. Could you please let me know if you offer a pause or freeze option for subscriptions?

If a pause isn't available, I would appreciate information about your most affordable plan or any current promotions that might help reduce my monthly cost.

Thank you for your understanding and assistance.

Best regards,
[Your Name]`
      };
      
      setAiResult(responses[type] || 'AI analysis complete. Consider reviewing your unused subscriptions for potential savings.');
    } catch (e) {
      setAiResult('Request failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                CleanSlate
              </div>
              <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                Digital Life Decluttering Platform
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-600 font-medium">Welcome back, <span className="text-gray-900">{data.user.name}</span></p>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-xs text-green-600 font-bold">💰 Saved: ${data.user.totalSaved}</p>
                  <p className="text-xs text-blue-600 font-bold">🎯 Goal: ${data.user.savingsGoal}</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {data.user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: HomeIcon }, // Using renamed HomeIcon
              { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
              { id: 'emails', label: 'Email Cleanup', icon: Mail },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'border-blue-500 text-blue-600 bg-gradient-to-t from-blue-50 to-transparent rounded-t-lg shadow-sm' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 rounded-t-lg'
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
                title="Monthly Savings Potential" 
                value={`$${analytics.potentialSavings.toFixed(0)}`}
                subtitle="From optimizing subscriptions"
                icon={DollarSign} 
                className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600" 
                trend={12}
              />
              <StatCard 
                title="Current Monthly Spend" 
                value={`$${analytics.monthlySpend.toFixed(0)}`}
                subtitle={`$${(analytics.monthlySpend * 12).toFixed(0)} annually`}
                icon={CreditCard} 
                className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600" 
                trend={-5}
              />
              <StatCard 
                title="Email Overload" 
                value={`${analytics.emailsPerWeek}`}
                subtitle="Weekly promotional emails"
                icon={Mail} 
                className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600" 
                trend={-8}
              />
              <StatCard 
                title="Savings Goal Progress" 
                value={`${analytics.progressToGoal.toFixed(0)}%`}
                subtitle={`$${(data.user.savingsGoal - data.user.totalSaved).toFixed(0)} to go`}
                icon={Target} 
                className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600" 
                trend={15}
              />
            </div>

            {/* Rest of your dashboard content */}
            <div className="text-center py-8">
              <p className="text-gray-600">Dashboard content continues here...</p>
              <p className="text-sm text-gray-500 mt-2">Add the remaining sections as needed</p>
            </div>
          </div>
        )}

        {/* Add other tabs content as needed */}
        {activeTab !== 'dashboard' && (
          <div className="text-center py-8">
            <p className="text-gray-600">Content for {activeTab} tab</p>
          </div>
        )}
      </main>
    </div>
  );
}
