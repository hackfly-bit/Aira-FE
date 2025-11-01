'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Footer } from './Footer'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export function DashboardLayout({ 
  children, 
  title = "Dashboard",
  className 
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setSidebarCollapsed(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:relative lg:translate-x-0",
          sidebarCollapsed && isMobile ? "-translate-x-full" : "translate-x-0"
        )}>
          <Sidebar 
            isCollapsed={sidebarCollapsed && !isMobile ? true : false}
            onToggle={toggleSidebar}
          />
        </aside>

        {/* Overlay untuk mobile */}
        {!sidebarCollapsed && isMobile && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <Header 
            title={title}
            onToggleSidebar={toggleSidebar}
          />

          {/* Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6">
              {children}
            </div>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  )
}