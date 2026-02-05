'use client';

import { useAuth, AuthProvider } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'react-router-dom';
import {
    Users,
    FileText,
    LayoutDashboard,
    LogOut,
    Settings,
    Database as DbIcon,
    Menu,
    X
} from 'lucide-react';

function AppContent({ children }: { children: React.ReactNode }) {
    const { user, userData, loading, signOut, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user && pathname !== '/login') {
            router.push('/login');
        }
    }, [user, loading, pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!user && pathname === '/login') {
        return <>{children}</>;
    }

    if (!user) return null;

    const navLinks = [
        { href: '/formulario', label: 'Pacientes', icon: Users },
        { href: '/relatorio', label: 'Gerar PTS', icon: FileText },
    ];

    if (isAdmin) {
        navLinks.push({ href: '/admin', label: 'Painel Admin', icon: LayoutDashboard });
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">A</span>
                            </div>
                            <span className="font-bold text-gray-900 hidden sm:inline-block">APAE INDAIAL</span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => router.push(link.href)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname.startsWith(link.href)
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <link.icon size={18} />
                                    {link.label}
                                </button>
                            ))}
                        </nav>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-900">{userData?.nome || 'Usuário'}</span>
                                <span className="text-xs text-gray-500 capitalize">{userData?.role || 'operador'}</span>
                            </div>

                            <button
                                onClick={() => {
                                    signOut();
                                    router.push('/login');
                                }}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                title="Sair"
                            >
                                <LogOut size={20} />
                            </button>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 py-3 px-4 flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => {
                                    router.push(link.href);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${pathname.startsWith(link.href)
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <link.icon size={20} />
                                {link.label}
                            </button>
                        ))}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
                    APAE DE INDAIAL - Sistema de Gestão PTS © 2026
                </div>
            </footer>
        </div>
    );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AppContent>{children}</AppContent>
        </AuthProvider>
    );
}
