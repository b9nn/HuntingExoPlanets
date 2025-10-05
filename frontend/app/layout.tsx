import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/providers/theme-provider'
import { ToastProvider } from '@/providers/toast-provider'
import { QueryProvider } from '@/providers/query-provider'
import { Sidebar } from '@/components/nav/sidebar'
import { Topbar } from '@/components/nav/topbar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'ExoAI - Exoplanet Discovery & Classification',
  description: 'Advanced AI-powered exoplanet discovery and classification system using ensemble machine learning models.',
  keywords: ['exoplanet', 'AI', 'machine learning', 'astronomy', 'NASA', 'space'],
  authors: [{ name: 'ExoAI Team' }],
  openGraph: {
    title: 'ExoAI - Exoplanet Discovery & Classification',
    description: 'Advanced AI-powered exoplanet discovery and classification system',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider />
            <div className="min-h-screen bg-background">
            <div className="flex">
              {/* Sidebar */}
              <aside className="hidden md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-card border-r">
                  <div className="flex items-center flex-shrink-0 px-4">
                    <Sidebar />
                  </div>
                </div>
              </aside>

              {/* Main content */}
              <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar />
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                  <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                      {children}
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
