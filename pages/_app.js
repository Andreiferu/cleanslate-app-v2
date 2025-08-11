import Head from 'next/head'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Register service worker quietly in background
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('PWA: Service Worker registered');
        })
        .catch((registrationError) => {
          console.log('PWA: Service Worker registration failed');
        });
    }
  }, []);

  return (
    <>
      <Head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CleanSlate" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-192x192.png" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
