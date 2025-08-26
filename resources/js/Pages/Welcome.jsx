import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import VigourLogo from '@/assets/vigour-logo.png';
import '../../css/fonts.css';

export default function Welcome({ auth }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [animateStats, setAnimateStats] = useState(false);

    // Sound effects using Web Audio API
    const playSound = (type) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'hover') {
                // Gentle hover sound
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            } else if (type === 'click') {
                // Success click sound
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.05);
                gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.15);
            }
        } catch (error) {
            // Silently handle browsers that don't support Web Audio
        }
    };

    useEffect(() => {
        setIsLoaded(true);
        const timer = setTimeout(() => setAnimateStats(true), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title="Vigour Seeds - Welcome" />
            
            {/* Animated Background */}
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
                {/* Floating seed particles */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-float opacity-30"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${3 + Math.random() * 2}s`
                            }}
                        >
                            <div className="w-3 h-3 bg-[#37692F] rounded-full shadow-lg"></div>
                        </div>
                    ))}
                </div>

                {/* Navigation */}
                <nav className={`relative z-10 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                    <div className="bg-white/90 backdrop-blur-md shadow-lg border-b border-green-100">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center py-4">
                                {/* Logo Section */}
                                <div className="flex items-center space-x-3">
                                    <img 
                                        src={VigourLogo} 
                                        alt="Vigour Seeds Logo" 
                                        className="h-12 w-12 animate-pulse"
                                    />
                                    <h1 className="text-2xl font-[800] text-[#37692F]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                        VIGOUR SEEDS
                                    </h1>
                                </div>
                                
                                {/* Navigation Links */}
                                <div className="flex items-center space-x-4">
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="bg-[#37692F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                            onMouseEnter={() => playSound('hover')}
                                            onClick={() => playSound('click')}
                                        >
                                            Go to Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="text-[#37692F] hover:text-green-700 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-green-50 font-medium"
                                                onMouseEnter={() => playSound('hover')}
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="bg-[#37692F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                                onMouseEnter={() => playSound('hover')}
                                                onClick={() => playSound('click')}
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

                {/* Hero Section */}
                <main className="relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                        {/* Hero Content */}
                        <div className={`text-center transition-all duration-1200 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <h1 className="text-5xl md:text-7xl font-[800] text-[#37692F] mb-6 animate-fade-in-up" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                Welcome to
                                <br />
                                <span className="text-[#333333] font-[400]">VIGOUR SEEDS</span>
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                                [Placeholder: Your premium destination for high-quality seeds and agricultural solutions. 
                                Discover our extensive collection of seeds that bring your garden dreams to life.]
                            </p>
                            
                            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
                                [Placeholder: Join thousands of satisfied gardeners who trust Vigour Seeds for their 
                                growing needs. From vegetables to flowers, we have everything you need to cultivate success.]
                            </p>

                            {/* Call to Action Buttons */}
                            {!auth.user && (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                                    <Link
                                        href={route('register')}
                                        className="bg-[#37692F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                                        onMouseEnter={() => playSound('hover')}
                                        onClick={() => playSound('click')}
                                    >
                                        Start Growing Today
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="border-2 border-[#37692F] text-[#37692F] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#37692F] hover:text-white transition-all duration-300 transform hover:scale-105"
                                        onMouseEnter={() => playSound('hover')}
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Features Grid */}
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 transition-all duration-1000 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            {/* Feature 1 */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-100">
                                <div className="w-16 h-16 bg-[#37692F] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    Premium Quality
                                </h3>
                                <p className="text-gray-600">
                                    [Placeholder: High-quality seeds with guaranteed germination rates and superior genetic traits for optimal growing success.]
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-100">
                                <div className="w-16 h-16 bg-[#37692F] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    Wide Variety
                                </h3>
                                <p className="text-gray-600">
                                    [Placeholder: Extensive collection of seeds from vegetables and herbs to flowers and trees, perfect for any garden size.]
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-100">
                                <div className="w-16 h-16 bg-[#37692F] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    Expert Support
                                </h3>
                                <p className="text-gray-600">
                                    [Placeholder: Professional guidance and growing tips from our team of agricultural experts and experienced gardeners.]
                                </p>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className={`mt-20 transition-all duration-1000 delay-900 ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#37692F] mb-2 animate-counter">10,000+</div>
                                    <div className="text-gray-600">Seeds Available</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#37692F] mb-2 animate-counter">500+</div>
                                    <div className="text-gray-600">Happy Gardeners</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#37692F] mb-2 animate-counter">50+</div>
                                    <div className="text-gray-600">Varieties</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#37692F] mb-2 animate-counter">24/7</div>
                                    <div className="text-gray-600">Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 bg-gray-800 text-white py-12 mt-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <img src={VigourLogo} alt="Vigour Seeds" className="h-8 w-8" />
                            <span className="text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                VIGOUR SEEDS
                            </span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            [Placeholder: Growing excellence with premium quality seeds for passionate gardeners worldwide.]
                        </p>
                        <p className="text-gray-500">
                            © 2025 Vigour Seeds. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
                    50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
                }
                
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes counter {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out;
                }
                
                .animate-counter {
                    animation: counter 0.8s ease-out;
                }
            `}</style>
        </>
    );
}
