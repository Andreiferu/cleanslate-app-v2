// pages/index.jsx - CleanSlate Beautiful Version with Background PWA
import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { 
  Mail, 
  CreditCard, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  Home as HomeIcon,
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
  Play,
  ChevronDown,
  ChevronUp
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
    { id: 7, sender: 'RetailMeNot', type: 'promotional', frequency: 'daily', unsubscribed: false, emailsPerWeek: 12, category: 'Shopping', importance: 'low' },
    { id: 8, sender: 'Coursera', type: 'newsletter', frequency: 'weekly', unsubscribed: false, emailsPerWeek: 2, category: 'Education', importance: 'high' }
  ],
  insights: [
    { id: 1, type: 'warning', title: 'Unused Adobe Creative Cloud', message: 'You haven\'t used Adobe CC in 3 months. Consider pausing to save $52.99/month.', impact: 52.99 },
    { id: 2, type: 'tip', title: 'Annual Billing Savings', message: 'Switch LinkedIn Premium to annual billing to save 25% ($89.97/year).', impact: 89.97 },
    { id: 3, type: 'success', title: 'Great Progress!', message: 'You\'ve already saved $247.80 this year. You\'re 83% to your $300 goal!', impact: 0 },
    { id: 4, type: 'warning', title: 'High Email Volume', message: 'You receive 43 promotional emails per week. Consider unsubscribing from low-priority senders.', impact: 0 }
  ]
};

// Simple in-memory storage
let appState = { ...defaultData };

const StatCard = ({ title, value, icon: Icon, className = '', subtitle = '', trend = null, onClick = null }) => (
  <div 
    className={`p-4 sm:p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer backdrop-blur-sm active:scale-95 ${className}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm opacity-90 font-medium truncate">{title}</p>
        <div className="flex items-baseline space-x-1 sm:space-x-2">
          <p className="text-xl sm:text-3xl font-bold truncate">{value}</p>
          {trend && (
            <span className={`text-xs sm:text-sm flex items-center ${trend > 0 ? 'text-green-200' : 'text-red-200'}`}>
              <TrendingUp className={`h-2 w-2 sm:h-3 sm:w-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs opacity-80 mt-1 truncate">{subtitle}</p>}
      </div>
      <div className="ml-2 sm:ml-4 flex-shrink-0">
        <Icon className="h-8 w-8 sm:h-12 sm:w-12 opacity-80" />
      </div>
    </div>
  </div>
);

const SubscriptionCard = ({ subscription, onCancel, onPause, onActivate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusIcon = () => {
    switch (subscription.status) {
      case 'active': return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
      case 'unused': return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />;
      case 'forgotten': return <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
      case 'paused': return <Pause className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
      case 'cancelled': return <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
      default: return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />;
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
    <div className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <div className="text-2xl sm:text-3xl bg-white p-2 rounded-xl shadow-sm flex-shrink-0">{subscription.logo}</div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-gray-900 text-base sm:text-lg truncate">{subscription.name}</h4>
            <p className="text-sm text-gray-600 font-medium truncate">{subscription.category}</p>
            <div className="flex items-center space-x-2 mt-2">
              {getStatusIcon()}
              <span className="text-sm capitalize text-gray-700 font-medium">{subscription.status}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right flex-shrink-0 ml-3">
          <p className="font-bold text-lg sm:text-2xl text-gray-900">${subscription.amount}</p>
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center sm:justify-start space-x-1 py-2 px-3 bg-blue-50 rounded-lg sm:bg-transparent sm:p-0"
        >
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span>{showDetails ? 'Less details' : 'More details'}</span>
        </button>
        
        {subscription.status !== 'cancelled' && (
          <div className="flex space-x-2">
            {subscription.status === 'active' && (
              <button
                onClick={() => handleAction('pause')}
                disabled={isLoading}
                className="flex-1 sm:flex-none bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium shadow-sm active:scale-95 min-h-[40px] flex items-center justify-center"
              >
                {isLoading ? 'Processing...' : 'Pause'}
              </button>
            )}
            {subscription.status === 'paused' && (
              <button
                onClick={() => handleAction('activate')}
                disabled={isLoading}
                className="flex-1 sm:flex-none bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors disabled:opacity-50 font-medium shadow-sm flex items-center justify-center space-x-1 active:scale-95 min-h-[40px]"
              >
                <Play className="h-4 w-4" />
                <span>{isLoading ? 'Processing...' : 'Reactivate'}</span>
              </button>
            )}
            <button
              onClick={() => handleAction('cancel')}
              disabled={isLoading}
              className="flex-1 sm:flex-none bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-1 font-medium shadow-sm active:scale-95 min-h-[40px]"
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
      case 'warning': return <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />;
      case 'tip': return <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
      default: return <Target className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
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
    <div className={`p-3 sm:p-4 rounded-xl border-2 ${getInsightColor()} transition-all duration-200 hover:shadow-lg active:scale-95`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0 mt-0.5">{getInsightIcon()}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{insight.title}</h4>
            <p className="text-xs sm:text-sm text-gray-700">{insight.message}</p>
            {insight.impact > 0 && (
              <p className="text-xs sm:text-sm font-medium text-green-600 mt-2">
                💰 Potential savings: ${insight.impact.toFixed(2)}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onDismiss(insight.id)}
          className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0 p-1 rounded-full hover:bg-gray-200 active:scale-95"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const EmailCard = ({ email, onUnsubscribe, onResubscribe }) => {
  const [isLoading, setIsLoading] = useState(false);

  const getImportanceColor = () => {
    switch (email.importance) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = async (action) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (action === 'unsubscribe') {
        onUnsubscribe(email.id);
      } else {
        onResubscribe(email.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 ${
      email.unsubscribed ? 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100' : 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-bold text-gray-900 text-base sm:text-lg truncate">{email.sender}</h4>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getImportanceColor()}`}>
              {email.importance}
            </span>
          </div>
          <p className="text-sm text-gray-600 font-medium mb-1">{email.category}</p>
          <p className="text-xs text-gray-500">
            {email.emailsPerWeek} emails per week • {email.frequency}
          </p>
        </div>
        
        <div className="text-right flex-shrink-0 ml-3">
          <p className="text-lg sm:text-xl font-bold text-gray-900">{email.emailsPerWeek}</p>
          <p className="text-xs text-gray-500 font-medium">per week</p>
          {email.unsubscribed && (
            <p className="text-xs text-green-600 font-medium">✓ Unsubscribed</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        {!email.unsubscribed ? (
          <button
            onClick={() => handleAction('unsubscribe')}
            disabled={isLoading}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-50 font-medium shadow-sm active:scale-95 flex items-center space-x-1"
          >
            <Mail className="h-4 w-4" />
            <span>{isLoading ? 'Unsubscribing...' : 'Unsubscribe'}</span>
          </button>
        ) : (
          <button
            onClick={() => handleAction('resubscribe')}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium shadow-sm active:scale-95"
          >
            {isLoading ? 'Resubscribing...' : 'Resubscribe'}
          </button>
        )}
      </div>
    </div>
  );
};

export default function CleanSlateApp() {
  const [data, setData] = useState(appState);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('amount');
  
  // PWA State (running quietly in background)
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Update app state when data changes
  useEffect(() => {
    appState = { ...data };
  }, [data]);

  // PWA functionality running quietly in background
  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = window.navigator && window.navigator.standalone === true;
    setIsInstalled(isStandalone || isInWebAppiOS);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

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
  const cancelSubscription = (id) => {
    setData(prev => ({
      ...prev,
      subscriptions: prev.subscriptions.map(s => s.id === id ? { ...s, status: 'cancelled' } : s),
      user: { ...prev.user, totalSaved: prev.user.totalSaved + prev.subscriptions.find(s => s.id === id).amount }
    }));
    
    // Show notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      const subscription = data.subscriptions.find(s => s.id === id);
      new Notification('Subscription Cancelled', {
        body: `${subscription.name} has been cancelled. You'll save ${subscription.amount}/month!`,
        icon: '/icons/icon-192x192.png'
      });
    }
  };

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
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type, maxTokens: 500 })
      });
      
      if (response.ok) {
        const result = await response.json();
        setAiResult(result.content);
      } else {
        // Fallback responses if API fails
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
      }
    } catch (e) {
      setAiResult('AI analysis complete. Consider reviewing your unused subscriptions for potential savings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>CleanSlate - Digital Life Decluttering</title>
        <meta name="description" content="Manage subscriptions, clean up emails, and optimize your digital spending with smart analytics and AI recommendations." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CleanSlate" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        
        {/* Beautiful Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                <div className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  CleanSlate
                </div>
                <span className="hidden sm:inline-block text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                  Digital Life Decluttering Platform
                </span>
                {isInstalled && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    📱 App
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 sm:space-x-6">
                <div className="text-right hidden md:block">
                  <p className="text-sm text-gray-600 font-medium">Welcome back, <span className="text-gray-900">{data.user.name}</span></p>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-xs text-green-600 font-bold">💰 Saved: ${data.user.totalSaved}</p>
                    <p className="text-xs text-blue-600 font-bold">🎯 Goal: ${data.user.savingsGoal}</p>
                  </div>
                </div>
                {/* Mobile user info */}
                <div className="md:hidden text-right">
                  <p className="text-xs text-green-600 font-bold">${data.user.totalSaved} saved</p>
                  <p className="text-xs text-blue-600 font-bold">{Math.round(analytics.progressToGoal)}% goal</p>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg">
                  {data.user.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Beautiful Navigation */}
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-16 sm:top-20 z-40">
          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto px-3 sm:px-6 scrollbar-hide">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
                { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
                { id: 'emails', label: 'Email Cleanup', icon: Mail },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col sm:flex-row items-center justify-center sm:space-x-2 py-3 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-all duration-300 whitespace-nowrap min-w-[80px] sm:min-w-0 ${
                      activeTab === tab.id 
                        ? 'border-blue-500 text-blue-600 bg-gradient-to-t from-blue-50 to-transparent rounded-t-lg shadow-sm' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 rounded-t-lg active:scale-95'
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-4 sm:w-4" />
                    <span className="mt-1 sm:mt-0">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              
              {/* Beautiful Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard 
                  title="Monthly Savings Potential" 
                  value={`${analytics.potentialSavings.toFixed(0)}`}
                  subtitle="From optimizing subscriptions"
                  icon={DollarSign} 
                  className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600" 
                  trend={12}
                />
                <StatCard 
                  title="Current Monthly Spend" 
                  value={`${analytics.monthlySpend.toFixed(0)}`}
                  subtitle={`${(analytics.monthlySpend * 12).toFixed(0)} annually`}
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
                  subtitle={`${(data.user.savingsGoal - data.user.totalSaved).toFixed(0)} to go`}
                  icon={Target} 
                  className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600" 
                  trend={15}
                />
              </div>

              {/* Smart Insights Section */}
              {data.insights && data.insights.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center mb-2 sm:mb-0">
                      <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mr-2 sm:mr-3" />
                      Smart Insights & Recommendations
                    </h3>
                    <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full self-start">
                      {data.insights.length} insights
                    </span>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {data.insights.map(insight => (
                      <InsightCard
                        key={insight.id}
                        insight={insight}
                        onDismiss={dismissInsight}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Priority Actions Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center mb-4 sm:mb-6">
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mr-2 sm:mr-3" />
                  Priority Actions - High Impact
                </h3>
                <p className="text-sm text-gray-600 mb-4">Save up to ${analytics.potentialSavings.toFixed(2)}/month</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.subscriptions.filter(s => s.status === 'unused' || s.status === 'forgotten').slice(0, 3).map(subscription => (
                    <div key={subscription.id} className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{subscription.logo}</span>
                        <div>
                          <h4 className="font-bold text-gray-900">{subscription.name}</h4>
                          <p className="text-sm text-red-600 font-medium">
                            {subscription.status === 'unused' ? '⚠️ Unused' : '🚨 Forgotten'} • Last used: {subscription.lastUsed}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-green-600 mb-3">Save ${subscription.amount}/month</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => pauseSubscription(subscription.id)}
                          className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 font-medium"
                        >
                          Pause
                        </button>
                        <button
                          onClick={() => cancelSubscription(subscription.id)}
                          className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Annual Billing Opportunities */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center mb-4">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 sm:mr-3" />
                  Annual Billing Opportunities
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  You could save ${analytics.yearlyDiscount.toFixed(2)} annually by switching to yearly billing for eligible subscriptions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.subscriptions.filter(s => s.yearlyDiscount > 0 && s.status !== 'cancelled').slice(0, 4).map(subscription => (
                    <div key={subscription.id} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{subscription.logo}</span>
                          <span className="font-bold text-gray-900">{subscription.name}</span>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                          {subscription.yearlyDiscount}% off
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Save ${(subscription.amount * 12 * subscription.yearlyDiscount / 100).toFixed(2)}/year
                      </p>
                      <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 font-medium">
                        Switch to Annual
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Assistant Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center mb-4">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 mr-2 sm:mr-3" />
                  🤖 AI Financial Assistant
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get personalized recommendations for optimizing your subscriptions and reducing digital clutter.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => generateAIResponse('Analyze my subscriptions and provide recommendations for savings', 'analysis')}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium transition-colors"
                  >
                    {loading ? 'Analyzing...' : '📊 Analyze Subscriptions'}
                  </button>
                  <button
                    onClick={() => generateAIResponse('Write a professional email to pause my subscription', 'email')}
                    disabled={loading}
                    className="bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 disabled:opacity-50 font-medium transition-colors"
                  >
                    {loading ? 'Writing...' : '✉️ Draft Pause Email'}
                  </button>
                </div>

                {aiResult && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <Zap className="h-4 w-4 text-blue-500 mr-2" />
                      AI Recommendation
                    </h4>
                    <div className="text-sm text-gray-700 whitespace-pre-line">{aiResult}</div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6 animate-fade-in">
              {/* Search and Filter Controls */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search subscriptions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="unused">Unused</option>
                      <option value="forgotten">Forgotten</option>
                      <option value="paused">Paused</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="amount">Sort by Amount</option>
                      <option value="name">Sort by Name</option>
                      <option value="status">Sort by Status</option>
                      <option value="category">Sort by Category</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Subscriptions Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSubscriptions.map(subscription => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onCancel={cancelSubscription}
                    onPause={pauseSubscription}
                    onActivate={activateSubscription}
                  />
                ))}
              </div>

              {filteredSubscriptions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No subscriptions found matching your criteria.</p>
                </div>
              )}
            </div>
          )}

          {/* Email Cleanup Tab */}
          {activeTab === 'emails' && (
            <div className="space-y-6 animate-fade-in">
              {/* Email Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard 
                  title="Weekly Emails" 
                  value={`${analytics.emailsPerWeek}`}
                  subtitle="From promotional sources"
                  icon={Mail} 
                  className="bg-gradient-to-br from-red-500 via-pink-500 to-rose-600" 
                />
                <StatCard 
                  title="Time Wasted" 
                  value={`${analytics.timeWasted}min`}
                  subtitle="Per week managing emails"
                  icon={Clock} 
                  className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600" 
                />
                <StatCard 
                  title="Unsubscribed" 
                  value={`${data.emails.filter(e => e.unsubscribed).length}`}
                  subtitle={`Out of ${data.emails.length} sources`}
                  icon={CheckCircle} 
                  className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600" 
                />
              </div>

              {/* Email List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.emails.map(email => (
                  <EmailCard
                    key={email.id}
                    email={email}
                    onUnsubscribe={unsubscribeEmail}
                    onResubscribe={resubscribeEmail}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fade-in">
              {/* Analytics Overview */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{analytics.totalSubscriptions}</div>
                  <div className="text-sm text-gray-600">Total Subscriptions</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{analytics.activeSubscriptions}</div>
                  <div className="text-sm text-gray-600">Active</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{analytics.unusedSubscriptions}</div>
                  <div className="text-sm text-gray-600">Unused</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{analytics.forgottenSubscriptions}</div>
                  <div className="text-sm text-gray-600">Forgotten</div>
                </div>
              </div>

              {/* Monthly Breakdown */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Monthly Breakdown</h3>
                <div className="space-y-4">
                  {data.subscriptions.filter(s => s.status !== 'cancelled').map(subscription => (
                    <div key={subscription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{subscription.logo}</span>
                        <div>
                          <span className="font-medium text-gray-900">{subscription.name}</span>
                          <span className={`ml-2 text-xs px-2 py-1 rounded-full font-medium ${
                            subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                            subscription.status === 'unused' ? 'bg-yellow-100 text-yellow-800' :
                            subscription.status === 'forgotten' ? 'bg-red-100 text-red-800' :
                            subscription.status === 'paused' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {subscription.status}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">${subscription.amount}/mo</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Monthly Cost:</span>
                    <span className="text-blue-600">${analytics.monthlySpend.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Annual Cost:</span>
                    <span>${(analytics.monthlySpend * 12).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Savings Potential */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Savings Potential</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                    <h4 className="font-bold text-green-800 mb-2">Monthly Potential</h4>
                    <p className="text-2xl font-bold text-green-600">${analytics.potentialSavings.toFixed(2)}</p>
                    <p className="text-sm text-green-700">From unused/forgotten subscriptions</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                    <h4 className="font-bold text-blue-800 mb-2">Annual Billing Savings</h4>
                    <p className="text-2xl font-bold text-blue-600">${analytics.yearlyDiscount.toFixed(2)}</p>
                    <p className="text-sm text-blue-700">From switching to yearly plans</p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </main>

        {/* Quiet PWA install notification */}
        {deferredPrompt && !isInstalled && (
          <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg z-50 max-w-xs">
            <p className="text-sm font-medium">Install CleanSlate as an app?</p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={async () => {
                  deferredPrompt.prompt();
                  const { outcome } = await deferredPrompt.userChoice;
                  setDeferredPrompt(null);
                }}
                className="bg-white text-blue-500 px-3 py-1 rounded text-sm font-medium"
              >
                Install
              </button>
              <button
                onClick={() => setDeferredPrompt(null)}
                className="text-white hover:bg-blue-600 px-3 py-1 rounded text-sm"
              >
                Later
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
