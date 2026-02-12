'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LoginUseCase } from '@/domain/usecases/user/LoginUseCase';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Checking authentication...');
    
    if (!LoginUseCase.isAuthenticated()) {
      console.log('❌ Not authenticated, redirecting to login');
      router.push('/login');
      return;
    }
    
    const storedUser = LoginUseCase.getStoredUser();
    console.log('👤 Stored user:', storedUser);
    
    let userData = storedUser;
    
    if (!userData) {
      console.log('⚠️ No stored user, checking localStorage...');
      
      // Intentar diferentes claves comunes
      const userKeys = ['user', 'userData', 'currentUser', 'auth_user'];
      for (const key of userKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            userData = JSON.parse(data);
            console.log(`✅ Found user data in localStorage.${key}:`, userData);
            break;
          } catch (e) {
            console.log(`❌ Failed to parse localStorage.${key}`);
          }
        }
      }
    }
    
    setUser(userData);
    setLoading(false);
    
    console.log('✅ Final user data:', userData);
  }, [router]);

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    LoginUseCase.logout();
    router.push('/auth/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Productos',
      href: '/products',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    }
  ];

  if (!LoginUseCase.isAuthenticated()) {
    return null;
  }

  // Helper para obtener las iniciales
  const getInitials = () => {
    if (!user) return 'L';
    
    // Intentar diferentes combinaciones de campos
    const firstName = user.firstName || user.first_name || user.name?.split(' ')[0] || '';
    const lastName = user.lastName || user.last_name || user.name?.split(' ')[1] || '';
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    
    if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    }
    
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return 'US';
  };

  // Helper para obtener el nombre completo
  const getFullName = () => {
    if (!user) return 'Usuario';
    
    const firstName = user.firstName || user.first_name || user.name?.split(' ')[0] || '';
    const lastName = user.lastName || user.last_name || user.name?.split(' ')[1] || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    
    if (firstName) {
      return firstName;
    }
    
    if (user.name) {
      return user.name;
    }
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'Usuario';
  };

  // Helper para obtener el email
  const getEmail = () => {
    return user?.email || user?.mail || 'lionosgame@gmail.com';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Siria Farma</h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 mt-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-l-4 border-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white border-l-4 border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sección de usuario - Siempre visible */}
        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {getFullName()}
              </p>
              <p className="text-xs text-gray-400 truncate">{getEmail()}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}