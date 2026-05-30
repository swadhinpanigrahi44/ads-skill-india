'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col`}>
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <Image
              src="/images/logo.png"
              alt="ADS Skill India"
              width={152}
              height={44}
              priority
              className="h-10 w-auto object-contain"
            />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <lord-icon
              src="https://cdn.lordicon.com/ujslquye.json"
              trigger="hover"
              colors="primary:#666666"
              style={{ width: '20px', height: '20px' }}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { label: 'Dashboard', icon: 'https://cdn.lordicon.com/kbtmeyae.json' },
            { label: 'Courses', icon: 'https://cdn.lordicon.com/eszltkdh.json' },
            { label: 'Analytics', icon: 'https://cdn.lordicon.com/xfftupgo.json' },
            { label: 'Users', icon: 'https://cdn.lordicon.com/iykgtsdc.json' },
            { label: 'Settings', icon: 'https://cdn.lordicon.com/bhrnlfqh.json' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
            >
              <lord-icon
                src={item.icon}
                trigger="hover"
                colors="primary:#0066ff"
                style={{ width: '20px', height: '20px' }}
              />
              {sidebarOpen && (
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{item.label}</span>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
            <lord-icon
              src="https://cdn.lordicon.com/qjinkcts.json"
              trigger="hover"
              colors="primary:#0066ff"
              style={{ width: '24px', height: '24px' }}
            />
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">Profile</p>
                <p className="text-xs text-gray-500 truncate">Logout</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
