'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginUseCase } from '@/domain/usecases/user/LoginUseCase';
import { ProductGetAll } from '@/domain/usecases/product/ProductGetAll';
import { ProductRepositoryImpl } from '@/infrastructure/repositories/products/ProductRepositoryImpl';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStock, setLowStock] = useState(0);

  // Datos simulados
  const [stats] = useState({
    totalClients: 156,
    totalSales: 1234,
    revenue: 45678.50,
  });

  // Datos para gráfica (simulados)
  const [salesData] = useState([
    { month: 'Ene', sales: 45 },
    { month: 'Feb', sales: 52 },
    { month: 'Mar', sales: 48 },
    { month: 'Abr', sales: 61 },
    { month: 'May', sales: 55 },
    { month: 'Jun', sales: 67 },
  ]);

  useEffect(() => {
    if (!LoginUseCase.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const storedUser = LoginUseCase.getStoredUser();
    setUser(storedUser);
    loadProductStats();
  }, [router]);

  const loadProductStats = async () => {
    try {
      const repository = new ProductRepositoryImpl();
      const useCase = new ProductGetAll(repository);
      const result = await useCase.execute(1, 100); // Obtener hasta 100 productos

      if (result.message.status) {
        setTotalProducts(result.products.length);
        const low = result.products.filter(p => p.stock < 10).length;
        setLowStock(low);
      }
    } catch (error) {
      console.error('Error loading product stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const maxSales = Math.max(...salesData.map(d => d.sales));

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Bienvenido de nuevo, {user?.firstName || 'Usuario'}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Productos - REAL */}
          <Link href="/products" className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Productos</p>
                <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
                {lowStock > 0 && (
                  <p className="text-xs text-red-600 mt-2">⚠️ {lowStock} con stock bajo</p>
                )}
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Total Clientes - SIMULADO */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Clientes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
                <p className="text-xs text-green-600 mt-2">↑ +12% este mes</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Ventas - SIMULADO */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Ventas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSales}</p>
                <p className="text-xs text-green-600 mt-2">↑ +8% este mes</p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Ingresos - SIMULADO */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ingresos</p>
                <p className="text-3xl font-bold text-gray-900">S/. {stats.revenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-2">↑ +15% este mes</p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Ventas Mensuales</h3>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>
            <div className="space-y-4">
              {salesData.map((data) => (
                <div key={data.month} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-12">{data.month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${(data.sales / maxSales) * 100}%` }}
                    >
                      <span className="text-white text-xs font-bold">{data.sales}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <Link
                href="/products"
                className="block w-full text-left px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-lg transition-colors text-sm text-gray-700 font-medium border border-blue-200"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Ver Productos
                </div>
              </Link>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700 font-medium">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nueva Venta
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700 font-medium">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generar Reporte
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Nueva venta registrada - S/. 150.00</span>
              <span className="text-xs text-gray-500 ml-auto">Hace 5 min</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Producto actualizado: Paracetamol 500mg</span>
              <span className="text-xs text-gray-500 ml-auto">Hace 15 min</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Stock bajo: Ibuprofeno 400mg ({lowStock} productos)</span>
              <span className="text-xs text-gray-500 ml-auto">Hace 1 hora</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}