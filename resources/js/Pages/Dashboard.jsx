import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import '../../css/fonts.css';
import { Link } from '@inertiajs/react';
import Vlogo from '@/assets/vigour-logo.png';

export default function Dashboard({ totalSeeds, activeContracts, lowStock, partnersCount, recentActivities = [] }) {
    const { auth } = usePage().props;
    const permissions = auth?.user?.can || [];
    const getTimeAgo = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
        return date.toLocaleDateString();
    };

    const getColorClass = (color) => {
        const colors = {
            green: 'bg-green-500',
            blue: 'bg-blue-500',
            yellow: 'bg-yellow-500',
            red: 'bg-red-500',
            purple: 'bg-purple-500',
            gray: 'bg-gray-500'
        };
        return colors[color] || 'bg-gray-500';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            
            {/* Modern Page Header */}
            <div className="relative bg-gradient-to-br from-white via-green-50/30 to-white border-b border-gray-200 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8fbc8f]/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#a8d5a8]/10 to-transparent rounded-full blur-2xl"></div>
                
                <div className="relative px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
                                <p className="text-gray-600">Welcome back! Here's an overview of your system</p>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-sm font-medium text-green-700">System Active</span>
                        </div>
                    </div>
                </div>
            </div>
                
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Dashboard Overview Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {permissions.includes('view seeds') && (
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-md bg-[#37692F] flex items-center justify-center">
                                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">Total Seeds</h3>
                                            <p className="text-2xl font-bold text-[#37692F]">{totalSeeds}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {permissions.includes('view contracts') && (
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-md bg-green-500 flex items-center justify-center">
                                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">Active Contracts</h3>
                                            <p className="text-2xl font-bold text-green-600">{activeContracts}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {permissions.includes('view inventory') && (
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-md bg-yellow-500 flex items-center justify-center">
                                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">Low Stock</h3>
                                            <p className="text-2xl font-bold text-yellow-600">{lowStock}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {permissions.includes('view partners') && (
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-md bg-blue-500 flex items-center justify-center">
                                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">Partners</h3>
                                            <p className="text-2xl font-bold text-blue-600">{partnersCount}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Dashboard Content */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                    {recentActivities.length > 0 ? (
                                        recentActivities.map((activity, index) => (
                                            <Link
                                                key={index}
                                                href={activity.link}
                                                className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors group"
                                            >
                                                <div className={`h-2 w-2 rounded-full ${getColorClass(activity.color)} flex-shrink-0`}></div>
                                                <p className="text-sm text-gray-600 flex-1 group-hover:text-gray-900">{activity.message}</p>
                                                <span className="text-xs text-gray-400 flex-shrink-0">{getTimeAgo(activity.timestamp)}</span>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-sm text-gray-500">No recent activity</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {permissions.includes('view inventory') && (
                                        <Link
                                            href={route('inventory.dashboard')}
                                            className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-[#37692F] hover:bg-green-50 transition-colors"
                                        >
                                            <div className="text-2xl mb-2">📦</div>
                                            <span className="text-sm font-medium text-gray-700">Add Inventory</span>
                                        </Link>
                                    )}
                                    {permissions.includes('view inventory') && (
                                        <Link
                                            href={route('partner-orders.index')}
                                            className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-[#37692F] hover:bg-green-50 transition-colors"
                                        >
                                            <div className="text-2xl mb-2">📋</div>
                                            <span className="text-sm font-medium text-gray-700">View Orders</span>
                                        </Link>
                                    )}
                                    {permissions.includes('view users') && (
                                        <Link
                                            href={route('users.index')}
                                            className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-[#37692F] hover:bg-green-50 transition-colors"
                                        >
                                            <div className="text-2xl mb-2">👥</div>
                                            <span className="text-sm font-medium text-gray-700">Manage Users</span>
                                        </Link>
                                    )}
                                    {permissions.includes('view contracts') && (
                                        <Link
                                            href={route('contracts.index')}
                                            className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-[#37692F] hover:bg-green-50 transition-colors"
                                        >
                                            <div className="text-2xl mb-2">📊</div>
                                            <span className="text-sm font-medium text-gray-700">View Contracts</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
