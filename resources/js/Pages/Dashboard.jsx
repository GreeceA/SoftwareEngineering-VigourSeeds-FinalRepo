import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import '../../css/fonts.css';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-[25px] font-[800]"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                    <span className="text-[#333333] font-[400]"> | Dashboard</span>
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Dashboard Overview Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 sm:rounded-lg border border-gray-100">
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
                                        <p className="text-2xl font-bold text-[#37692F]">1,247</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 sm:rounded-lg border border-gray-100">
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
                                        <h3 className="text-lg font-medium text-gray-900">Active Orders</h3>
                                        <p className="text-2xl font-bold text-green-600">23</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 sm:rounded-lg border border-gray-100">
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
                                        <p className="text-2xl font-bold text-yellow-600">8</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 sm:rounded-lg border border-gray-100">
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
                                        <h3 className="text-lg font-medium text-gray-900">Customers</h3>
                                        <p className="text-2xl font-bold text-blue-600">156</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Dashboard Content */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 sm:rounded-lg border border-gray-100">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <p className="text-sm text-gray-600">New order #1234 received</p>
                                        <span className="text-xs text-gray-400">2 hours ago</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                        <p className="text-sm text-gray-600">Tomato seeds running low</p>
                                        <span className="text-xs text-gray-400">4 hours ago</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        <p className="text-sm text-gray-600">Shipment #5678 delivered</p>
                                        <span className="text-xs text-gray-400">1 day ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 sm:rounded-lg border border-gray-100">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-[#37692F] hover:bg-green-50 transition-colors">
                                        <div className="text-2xl mb-2">📦</div>
                                        <span className="text-sm font-medium text-gray-700">Add Inventory</span>
                                    </button>
                                    <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-[#37692F] hover:bg-green-50 transition-colors">
                                        <div className="text-2xl mb-2">📋</div>
                                        <span className="text-sm font-medium text-gray-700">View Orders</span>
                                    </button>
                                    <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-[#37692F] hover:bg-green-50 transition-colors">
                                        <div className="text-2xl mb-2">👥</div>
                                        <span className="text-sm font-medium text-gray-700">Manage Users</span>
                                    </button>
                                    <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-[#37692F] hover:bg-green-50 transition-colors">
                                        <div className="text-2xl mb-2">📊</div>
                                        <span className="text-sm font-medium text-gray-700">View Reports</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
