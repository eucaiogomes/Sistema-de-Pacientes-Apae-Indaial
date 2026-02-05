'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAdmin, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.push('/login');
        }
    }, [user, isAdmin, loading, router]);

    if (loading) return null;
    if (!user || !isAdmin) return null;

    return (
        <div className="admin-wrapper bg-gray-50 min-h-screen">
            {/* Reusing the main app layout for now but wrapped with admin check */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {children}
            </div>
        </div>
    );
}
