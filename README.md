# 🚀 CleanSlate - Digital Life Decluttering App

A modern Progressive Web Application (PWA) for managing subscriptions and digital clutter with AI-powered insights.

## ✨ Features

- 📊 **Subscription Management**: Track, pause, and cancel subscriptions
- 📧 **Email Cleanup**: Manage promotional emails and newsletters  
- 🤖 **AI Assistant**: Get personalized financial recommendations
- 📈 **Analytics Dashboard**: Visualize spending patterns and savings
- 💰 **Savings Tracking**: Monitor potential and actual savings
- 📱 **PWA Support**: Install as native app on mobile and desktop
- 🔄 **Offline Functionality**: Works without internet connection

## 🎯 What's New in This Version

- ✅ **Beautiful Design**: Gradient backgrounds, modern UI, smooth animations
- ✅ **Background PWA**: Install functionality without intrusive UI elements
- ✅ **Mobile Optimized**: Perfect responsive design for all devices
- ✅ **Production Ready**: Deployed and tested on Vercel

## 🚀 Quick Start

### Deploy to Vercel

1. **Get OpenAI API Key** (optional for AI features):
   - Go to [platform.openai.com](https://platform.openai.com)
   - Create account and get API key

2. **Deploy**:
   - Fork this repository
   - Go to [vercel.com](https://vercel.com) 
   - Import your GitHub repository
   - Add environment variable: `OPENAI_API_KEY`
   - Deploy!

### Local Development

```bash
# Install dependencies
npm install

# Add your OpenAI API key to .env.local
echo "OPENAI_API_KEY=your_key_here" > .env.local

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📱 Installing as PWA

The app can be installed on any device:

### Mobile (Android/iOS)
1. Open the app in your browser
2. Look for the install prompt (appears after 5 seconds)
3. Or use browser menu → "Add to Home screen"

### Desktop (Chrome/Edge/Safari)
1. Look for the install icon in the address bar
2. Or use browser menu → "Install CleanSlate"

## 🛠️ Technology Stack

- **Framework**: Next.js 14
- **Frontend**: React 18 + Tailwind CSS
- **Icons**: Lucide React
- **PWA**: Custom Service Worker + Web Manifest
- **AI**: OpenAI GPT-4 integration
- **Deployment**: Vercel

## 📁 Project Structure

```
cleanslate-app/
├── pages/
│   ├── _app.js          # App wrapper with PWA setup
│   ├── index.jsx        # Main application
│   └── api/
│       └── openai.js    # AI API endpoint
├── public/
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service worker
│   └── icons/          # App icons
├── styles/
│   └── globals.css     # Global styles
└── config files...
```

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful blue-to-indigo gradients
- **Glassmorphism**: Backdrop blur effects throughout
- **Micro-interactions**: Hover animations and smooth transitions
- **Mobile-first**: Responsive design that works on all screen sizes
- **Accessibility**: Semantic HTML and proper contrast ratios

## 💡 Key Components

- **StatCard**: Animated metric cards with trend indicators
- **SubscriptionCard**: Full-featured subscription management
- **InsightCard**: AI-powered recommendations
- **EmailCard**: Email unsubscribe management
- **PWA Integration**: Background install prompts

## ⚡ Performance Features

- **Service Worker**: Caches app for offline use
- **Code Splitting**: Automatic bundle optimization
- **Image Optimization**: WebP/AVIF format support
- **Compression**: Gzip compression enabled
- **Security Headers**: XSS and clickjacking protection

## 🔧 Configuration

### Environment Variables
```bash
OPENAI_API_KEY=your_openai_api_key_here  # Optional, for AI features
```

### PWA Settings
All PWA settings are configured in:
- `public/manifest.json` - App metadata
- `public/sw.js` - Service worker logic
- `next.config.js` - Build optimization

## 🚀 Deployment Notes

- **Vercel**: Optimized for Vercel deployment
- **HTTPS Required**: PWA features require secure connection
- **Icon Requirements**: Multiple icon sizes included
- **Caching Strategy**: Smart caching for optimal performance

## 📊 Features Overview

### Dashboard
- Monthly savings potential tracking
- Current spending overview
- Email overload metrics
- Savings goal progress

### Subscriptions
- Visual status indicators (active, unused, forgotten, paused)
- Quick action buttons (pause, cancel, reactivate)
- Detailed billing information
- Search and filter capabilities

### Email Management
- Promotional email tracking
- Bulk unsubscribe options
- Importance categorization
- Time waste calculations

### AI Assistant
- Subscription analysis and recommendations
- Email template generation
- Personalized savings strategies
- Financial optimization tips

## 🎯 Success Metrics

This version achieves:
- ✅ **Perfect PWA Score**: All PWA requirements met
- ✅ **Mobile Performance**: Fast loading on all devices
- ✅ **User Experience**: Intuitive and beautiful interface
- ✅ **Production Ready**: Tested and deployed successfully

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using Next.js, React, and modern web technologies.**
