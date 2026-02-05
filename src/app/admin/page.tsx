'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import {
    Users,
    FileText,
    Activity,
    Database as DbIcon,
    Shield,
    ArrowRight,
    TrendingUp,
    Download,
    Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const { isAdmin, loading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalPacientes: 0,
        totalUsuarios: 0,
        ptsMes: 0,
    });

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/formulario');
        }
        fetchStats();
    }, [isAdmin, loading]);

    const fetchStats = async () => {
        const { count: pCount } = await supabase.from('pacientes').select('*', { count: 'exact', head: true });
        const { count: uCount } = await supabase.from('usuarios').select('*', { count: 'exact', head: true });

        // Get PTS count for current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const { count: ptsCount } = await supabase
            .from('pts')
            .select('*', { count: 'exact', head: true })
            .gte('criado_em', startOfMonth.toISOString());

        setStats({
            totalPacientes: pCount || 0,
            totalUsuarios: uCount || 0,
            ptsMes: ptsCount || 0,
        });
    };

    const menuItems = [
        { label: 'Gerenciar Usuários', icon: Users, href: '/admin/usuarios', color: 'blue' },
        { label: 'Estrutura de Tabelas', icon: DbIcon, href: '/admin/tabelas', color: 'purple' },
        { label: 'Visualizar Dados', icon: Activity, href: '/admin/dados', color: 'green' },
        { label: 'Backup do Sistema', icon: Download, href: '/admin/backup', color: 'orange' },
        { label: 'Configurações', icon: Shield, href: '/admin/configuracoes', color: 'gray' },
    ];

    if (loading) return null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-gray-500">Visão geral e ferramentas de gestão do sistema.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Total de Pacientes</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalPacientes}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                            <Shield size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Funcionários Ativos</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsuarios}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                            <FileText size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                            <TrendingUp size={14} />
                            Este mês
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">PTS Gerados</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.ptsMes}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Management Links */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 ml-1">Atalhos de Gestão</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {menuItems.map((item) => (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg bg-${item.color}-50 text-${item.color}-600`}>
                                        <item.icon size={20} />
                                    </div>
                                    <span className="font-medium text-gray-700">{item.label}</span>
                                </div>
                                <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Activity (Placeholder for now) */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 ml-1">Atividades Recentes</h2>
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                        <div className="p-12 text-center text-gray-400">
                            <p>Os logs de atividade serão exibidos aqui.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
