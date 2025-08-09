// pages/index.jsx - Complete PWA CleanSlate Application
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
  Eye, 
  EyeOff,
  Filter,
  Plus,
  Play,
  Menu,
  ChevronDown,
  ChevronUp,
  Download,
  Bell,
  Wifi,
  WifiOff
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

// PWA Install Banner Component
const PWAInstallBanner = ({ onInstall, onDismiss, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl shadow-xl z-50 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="text-2xl">📱</div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm sm:text-base">Install CleanSlate</h4>
            <p className="text-xs sm:text-sm opacity-90">Add to your home screen for quick access!</p>
          </div>
        </div>
        <div className="flex space-x-2 flex-shrink-0 ml-3">
          <button
            onClick={onInstall}
            className="bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors active:scale-95"
          >
            Install
          </button>
          <button
            onClick={onDismiss}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

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

export default function CleanSlateApp() {
  const [data, setData] = useState(appState);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('amount');
  
  // PWA State
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Update app state when data changes
  useEffect(() => {
    appState = { ...data };
  }, [data]);

  // PWA Service Worker Registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('PWA: Service Worker registered successfully');
        })
        .catch((error) => {
          console.log('PWA: Service Worker registration failed:', error);
        });
    }
  }, []);

  // PWA Install Prompt Handling
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInWebAppiOS);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isInstalled) {
        setTimeout(() => setShowInstallBanner(true), 3000); // Show after 3 seconds
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      console.log('PWA: App was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

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
        body: `${subscription.name} has been cancelled. You'll save $${subscription.amount}/month!`,
        icon: '/favicon.ico'
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

  // PWA Actions
  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('PWA: Install prompt outcome:', outcome);
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

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
    <>
      <Head>
        <title>CleanSlate - Digital Life Decluttering</title>
        <meta name="description" content="Manage subscriptions, clean up emails, and optimize your digital spending with smart analytics and AI recommendations." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CleanSlate" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* PWA Install Banner */}
        <PWAInstallBanner 
          isVisible={showInstallBanner && !isInstalled}
          onInstall={handleInstallApp}
          onDismiss={() => setShowInstallBanner(false)}
        />

        {/* Mobile Optimized Header */}
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

        {/* Mobile Optimized Navigation */}
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
              {/* Mobile Optimized Stats Grid */}
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

              {/* Mobile Optimized Insights Section */}
              {data.insights && data.insights.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center mb-2 sm:mb-0">
                      <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mr-2 sm:mr-3" />
                      Smart Insights
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

              {/* Mobile Optimized Priority Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center mb-2 sm:mb-0">
                    <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 mr-2 sm:mr-3" />
                    Priority Actions
                  </h3>
                  <span className="text-xs sm:text-sm text-gray-500 bg-gradient-to-r from-orange-100 to-red-100 px-2 sm:px-3 py-1 rounded-full font-medium self-start">
                    Save up to ${analytics.potentialSavings.toFixed(2)}/month
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {data.subscriptions
                    .filter(s => s.status === 'forgotten' || s.status === 'unused')
                    .slice(0, 4)
                    .map(sub => (
                      <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 rounded-xl border-2 border-red-200 hover:shadow-lg transition-all duration-300 space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                          <div className="text-2xl sm:text-3xl bg-white p-2 rounded-lg shadow-sm flex-shrink-0">{sub.logo}</div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{sub.name}</p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {sub.status === 'forgotten' ? '🚨 Forgotten' : '⚠️ Unused'} • Last used: {sub.lastUsed}
                            </p>
                            <p className="text-xs sm:text-sm font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full inline-block mt-1">
                              Save ${sub.amount}/month
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2 w-full sm:w-auto">
                          <button 
                            onClick={() => pauseSubscription(sub.id)}
                            className="flex-1 sm:flex-none bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors font-medium shadow-sm active:scale-95 min-h-[40px]"
                          >
                            Pause
                          </button>
                          <button 
                            onClick={() => cancelSubscription(sub.id)}
                            className="flex-1 sm:flex-none bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors font-medium shadow-sm active:scale-95 min-h-[40px]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                
                {analytics.yearlyDiscount > 0 && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <h4 className="font-bold text-green-800 mb-2 flex items-center text-sm sm:text-base">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Annual Billing Opportunities
                    </h4>
                    <p className="text-xs sm:text-sm text-green-700">
                      You could save ${analytics.yearlyDiscount.toFixed(2)} annually by switching to yearly billing for eligible subscriptions.
                    </p>
                  </div>
                )}
              </div>

              {/* Mobile Optimized AI Assistant */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-3 sm:mb-4 flex items-center">
                  <span className="text-xl sm:text-2xl mr-2 sm:mr-3">🤖</span>
                  AI Financial Assistant
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                  Get personalized recommendations for optimizing your subscriptions and reducing digital clutter.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
                  <button 
                    onClick={() => generateAIResponse(`Analyze my subscriptions: ${JSON.stringify(data.subscriptions.map(s => ({name: s.name, amount: s.amount, status: s.status, lastUsed: s.lastUsed})))}. Give me 3 specific recommendations to save money.`, 'analysis')}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95 text-sm sm:text-base min-h-[48px] flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Analyzing...</span>
                      </div>
                    ) : 'Get Savings Recommendations'}
                  </button>
                  <button 
                    onClick={() => generateAIResponse('Write a polite email template to pause a subscription temporarily due to budget constraints.', 'email')}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95 text-sm sm:text-base min-h-[48px] flex items-center justify-center"
                  >
                    Email Template
                  </button>
                  <button 
                    onClick={() => setAiResult(null)}
                    className="bg-gray-200 text-gray-700 px-4 sm:px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium active:scale-95 text-sm sm:text-base min-h-[48px] flex items-center justify-center"
                  >
                    Clear
                  </button>
                </div>
                {aiResult && (
                  <div className="mt-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 p-4 sm:p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm sm:text-base">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2" />
                      AI Recommendation:
                    </h4>
                    <div className="text-gray-800 whitespace-pre-wrap font-medium leading-relaxed text-sm sm:text-base">{aiResult}</div>
                  </div>
                )}
              </div>

              {/* PWA Status */}
              <div className="text-center py-4 sm:py-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 inline-block">
                  <p className="text-sm sm:text-base text-gray-700 font-medium">
                    🎉 Your CleanSlate app is now a Progressive Web App!
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {isInstalled ? '✅ Installed as native app' : '📱 Install for the best experience'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs - Simplified for now */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Subscription Management</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
            </div>
          )}

          {activeTab === 'emails' && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Email Cleanup & Management</h2>
                
                {/* Quick Actions */}
                <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => {
                      const highVolumeEmails = data.emails.filter(e => !e.unsubscribed && e.emailsPerWeek > 5);
                      highVolumeEmails.forEach(email => unsubscribeEmail(email.id));
                    }}
                    className="bg-red-500 text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-red-600 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95 text-sm sm:text-base min-h-[48px]"
                  >
                    Unsubscribe High Volume (5+ emails/week)
                  </button>
                  <button
                    onClick={() => {
                      const lowImportanceEmails = data.emails.filter(e => !e.unsubscribed && e.importance === 'low');
                      lowImportanceEmails.forEach(email => unsubscribeEmail(email.id));
                    }}
                    className="bg-orange-500 text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95 text-sm sm:text-base min-h-[48px]"
                  >
                    Unsubscribe Low Priority
                  </button>
                </div>

                {/* Email List */}
                <div className="space-y-3 sm:space-y-4">
                  {data.emails.map(email => (
                    <div key={email.id} className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg active:scale-95 ${
                      email.unsubscribed 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                        : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm sm:text-lg mb-2">{email.sender}</h4>
                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                            <span className="font-medium">{email.emailsPerWeek} emails/week</span>
                            <span>• {email.frequency}</span>
                            <span>• {email.importance} priority</span>
                          </div>
                          {email.unsubscribed && (
                            <p className="text-xs sm:text-sm text-green-600 font-bold mt-2 flex items-center">
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              Successfully unsubscribed
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
                          {email.unsubscribed ? (
                            <button
                              onClick={() => resubscribeEmail(email.id)}
                              className="flex-1 sm:flex-none bg-blue-500 text-white px-4 sm:px-6 py-3 rounded-xl text-sm hover:bg-blue-600 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95 min-h-[44px] flex items-center justify-center"
                            >
                              Resubscribe
                            </button>
                          ) : (
                            <button
                              onClick={() => unsubscribeEmail(email.id)}
                              className="flex-1 sm:flex-none bg-red-500 text-white px-4 sm:px-6 py-3 rounded-xl text-sm hover:bg-red-600 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95 min-h-[44px] flex items-center justify-center"
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
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Advanced Analytics</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6">Comprehensive insights into your digital spending patterns.</p>
                
                {/* Analytics Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-blue-800 text-xs sm:text-sm mb-1">Total Subscriptions</h4>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">{analytics.totalSubscriptions}</p>
                    <p className="text-xs text-blue-600 mt-1">services tracked</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-green-800 text-xs sm:text-sm mb-1">Efficiency Rate</h4>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">
                      {Math.round((analytics.activeSubscriptions / analytics.totalSubscriptions) * 100)}%
                    </p>
                    <p className="text-xs text-green-600 mt-1">actively used</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl border border-purple-200">
                    <h4 className="font-semibold text-purple-800 text-xs sm:text-sm mb-1">Monthly Impact</h4>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-600">${analytics.potentialSavings.toFixed(0)}</p>
                    <p className="text-xs text-purple-600 mt-1">savings available</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-red-100 rounded-xl border border-orange-200">
                    <h4 className="font-semibold text-orange-800 text-xs sm:text-sm mb-1">Email Cleanup</h4>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                      {Math.round((data.emails.filter(e => e.unsubscribed).length / data.emails.length) * 100)}%
                    </p>
                    <p className="text-xs text-orange-600 mt-1">completed</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}app-capable" content="yes" />
        <meta name="apple-mobile-web-
