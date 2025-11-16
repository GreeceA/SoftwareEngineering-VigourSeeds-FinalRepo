import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import VigourLogo from '@/assets/vigour-logo.png';
import CornBg from '@/assets/corn.png';
import '../../css/fonts.css';

export default function Welcome({ auth }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [animateStats, setAnimateStats] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        const timer = setTimeout(() => setAnimateStats(true), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title="Vigour Seeds - Welcome" />

            <div className="min-h-screen bg-gray-50 relative overflow-hidden">
                {/* Decorative background elements matching system design */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#8fbc8f]/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#a8d5a8]/10 to-transparent rounded-full blur-2xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-50/30 rounded-full blur-3xl"></div>
                    
                    {/* Subtle floating seed particles */}
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-float opacity-20"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${4 + Math.random() * 2}s`
                            }}
                        >
                            <div className="w-2 h-2 bg-[#37692F] rounded-full"></div>
                        </div>
                    ))}
                </div>

                {/* Navigation - Matching system header */}
                <nav className={`sticky top-0 z-50 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                    <div className="bg-gradient-to-r from-[#37692F] to-[#4a8a3f] shadow-lg border-b border-[#2d5526]">
                        {/* Elegant geometric pattern overlay */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: `
                                radial-gradient(circle at 20% 50%, transparent 0%, rgba(255,255,255,0.1) 2px, transparent 2px),
                                radial-gradient(circle at 80% 50%, transparent 0%, rgba(255,255,255,0.1) 2px, transparent 2px),
                                linear-gradient(90deg, transparent 49.5%, rgba(255,255,255,0.05) 49.5%, rgba(255,255,255,0.05) 50.5%, transparent 50.5%)
                            `,
                            backgroundSize: '40px 40px, 40px 40px, 60px 100%'
                        }}></div>
                        
                        <div className="relative mx-auto max-w-full px-4">
                            <div className="flex justify-between items-center h-16">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={VigourLogo} 
                                        alt="Vigour Seeds Logo" 
                                        className="h-10 w-10 transition-transform duration-300 hover:scale-110"
                                    />
                                    <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '0.5px' }}>
                                        VIGOUR SEEDS
                                    </h1>
                                </div>

                                <div className="flex items-center space-x-3">
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="bg-white text-[#37692F] px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-md"
                                        >
                                            Get Started
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="text-white hover:text-gray-200 px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="bg-white text-[#37692F] px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-md"
                                            >
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section with Corn Field Background */}
                <main className="relative z-10">
                    {/* Hero Background Image Section */}
                    <div className="relative h-[600px] md:h-[700px] overflow-hidden">
                        {/* Background Image */}
                        <img 
                            src={CornBg} 
                            alt="Corn Background" 
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ filter: 'blur(0.5px) brightness(0.85)' }}
                        />
                        {/* Elegant gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent"></div>
                        {/* Smooth elegant bottom transition */}
                        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-50 via-gray-50/70 via-30% to-transparent"></div>

                        {/* Hero Content */}
                        <div className="relative h-full flex items-center">
                            <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 w-full">
                                <div className={`transition-all duration-1200 delay-300 text-left max-w-4xl ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                    <h1 className="mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                        <div className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4" 
                                             style={{ 
                                                 textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                                 letterSpacing: '-0.03em',
                                                 lineHeight: '1'
                                             }}>
                                            <span className="text-white">VIGOUR SEEDS</span>
                                        </div>
                                        <div className="text-2xl md:text-3xl lg:text-4xl font-medium text-white/90" 
                                             style={{ 
                                                 textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                                                 letterSpacing: '0.02em'
                                             }}>
                                            Company Management System
                                        </div>
                                    </h1>
                                    
                                    <div className="space-y-5 mb-12 border-l-4 border-white/30 pl-6">
                                        <p className="text-xl md:text-2xl lg:text-3xl text-white font-semibold leading-tight" 
                                           style={{ 
                                               textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                                               fontFamily: "'Poppins', sans-serif"
                                           }}>
                                            Streamline Your Corn Seed Operations
                                        </p>
                                        
                                        <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed font-normal max-w-2xl" 
                                           style={{ 
                                               textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                               letterSpacing: '0.01em'
                                           }}>
                                            Comprehensive management platform for contracts, inventory tracking, 
                                            field monitoring, and partner relationships—designed for agricultural professionals.
                                        </p>
                                    </div>

                                    
                                    {!auth.user && (
                                        <div className="flex justify-start mt-8">
                                            <Link
                                                href={route('register')}
                                                className="inline-flex items-center justify-center bg-[#37692F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#2a5624] transition-all duration-300 shadow-xl hover:shadow-2xl"
                                            >
                                                Start Growing Today
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                        {/* Features Grid - Matching system card design */}
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 transition-all duration-1000 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    Contract Management
                                </h3>
                                <p className="text-gray-600 text-center leading-relaxed">
                                    Create and manage partner contracts with seed commitments, track contract lifecycles, and handle buyback transactions efficiently.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    Inventory Tracking
                                </h3>
                                <p className="text-gray-600 text-center leading-relaxed">
                                    Monitor seed and item stock levels, track inventory movements, and manage partner orders with real-time updates.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#37692F] to-[#4a8a3f] rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    Field Monitoring
                                </h3>
                                <p className="text-gray-600 text-center leading-relaxed">
                                    Schedule and document field visits, submit growth and damage reports, and maintain comprehensive farm records.
                                </p>
                            </div>
                        </div>

                        {/* Stats Section - Modern card style */}
                        <div className={`transition-all duration-1000 delay-900 ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#37692F] to-[#4a8a3f] bg-clip-text text-transparent mb-2 animate-counter" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            Contract
                                        </div>
                                        <div className="text-sm md:text-base text-gray-600 font-medium">Management</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#37692F] to-[#4a8a3f] bg-clip-text text-transparent mb-2 animate-counter" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            Partner
                                        </div>
                                        <div className="text-sm md:text-base text-gray-600 font-medium">Relations</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#37692F] to-[#4a8a3f] bg-clip-text text-transparent mb-2 animate-counter" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            Inventory
                                        </div>
                                        <div className="text-sm md:text-base text-gray-600 font-medium">Control</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#37692F] to-[#4a8a3f] bg-clip-text text-transparent mb-2 animate-counter" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            Field
                                        </div>
                                        <div className="text-sm md:text-base text-gray-600 font-medium">Monitoring</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer - Matching system footer style */}
                <footer className="relative z-10 bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 mt-24 border-t-4 border-[#37692F]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-3 mb-6">
                                <img src={VigourLogo} alt="Vigour Seeds" className="h-10 w-10" />
                                <span className="text-2xl font-bold" style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '0.5px' }}>
                                    VIGOUR SEEDS
                                </span>
                            </div>
                            <p className="text-gray-300 mb-2 text-lg">
                                Empowering agricultural operations with intelligent management solutions
                            </p>
                            <p className="text-gray-400 mb-6">
                                Streamlining corn seed business processes for success
                            </p>
                            <div className="border-t border-gray-700 pt-6">
                                <p className="text-gray-500 text-sm">
                                    © 2025 Vigour Seeds. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Animations CSS */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.2; }
                    50% { transform: translateY(-15px) scale(1.1); opacity: 0.4; }
                }
                
                @keyframes counter {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                .animate-float { animation: float 5s ease-in-out infinite; }
                .animate-counter { animation: counter 0.6s ease-out; }

                /* Custom Scrollbar Styling */
                ::-webkit-scrollbar {
                    width: 12px;
                    height: 12px;
                }

                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #37692F, #4a8a3f);
                    border-radius: 10px;
                    border: 2px solid #f1f1f1;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, #2a5624, #37692F);
                }

                /* Firefox */
                * {
                    scrollbar-width: thin;
                    scrollbar-color: #37692F #f1f1f1;
                }
            `}</style>
        </>
    );
}
