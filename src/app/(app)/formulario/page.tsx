'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    FileText,
    ChevronRight,
    UserPlus
} from 'lucide-react';
import { Database } from '@/types/supabase';

type Paciente = Database['public']['Tables']['pacientes']['Row'];

export default function FormularioPage() {
    const { user, isAdmin } = useAuth();
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        nome: '',
        data_nascimento: '',
        cid: '',
        diagnostico: '',
    });

    useEffect(() => {
        fetchPacientes();
    }, [user]);

    const fetchPacientes = async () => {
        if (!user) return;
        setLoading(true);

        let query = supabase.from('pacientes').select('*');

        if (!isAdmin) {
            query = query.eq('usuario_id', user.id);
        }

        const { data, error } = await query.order('nome');

        if (!error && data) {
            setPacientes(data);
        }
        setLoading(false);
    };

    const calculateAge = (birthDate: string) => {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const pacienteData = {
            ...formData,
            idade: calculateAge(formData.data_nascimento),
            usuario_id: user.id,
            atualizado_em: new Date().toISOString(),
        };

        if (selectedPaciente) {
            // Update
            const { error } = await supabase
                .from('pacientes')
                .update(pacienteData)
                .eq('id', selectedPaciente.id);

            if (error) alert('Erro ao atualizar paciente');
        } else {
            // Create
            const { error } = await supabase
                .from('pacientes')
                .insert([pacienteData]);

            if (error) alert('Erro ao criar paciente');
        }

        setIsModalOpen(false);
        setSelectedPaciente(null);
        setFormData({ nome: '', data_nascimento: '', cid: '', diagnostico: '' });
        fetchPacientes();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.')) {
            const { error } = await supabase.from('pacientes').delete().eq('id', id);
            if (error) alert('Erro ao excluir paciente');
            else fetchPacientes();
        }
    };

    const openEdit = (paciente: Paciente) => {
        setSelectedPaciente(paciente);
        setFormData({
            nome: paciente.nome,
            data_nascimento: paciente.data_nascimento || '',
            cid: paciente.cid || '',
            diagnostico: paciente.diagnostico || '',
        });
        setIsModalOpen(true);
    };

    const filteredPacientes = pacientes.filter(p =>
        p.nome.toLowerCase().includes(search.toLowerCase()) ||
        (p.cid && p.cid.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestão de Pacientes</h1>
                    <p className="text-gray-500">Visualize e gerencie os cadastros dos pacientes.</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedPaciente(null);
                        setFormData({ nome: '', data_nascimento: '', cid: '', diagnostico: '' });
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
                >
                    <Plus size={20} />
                    Novo Paciente
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Buscar pacientes por nome ou CID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                />
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Carregando pacientes...</div>
                ) : filteredPacientes.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        {search ? 'Nenhum paciente encontrado para esta busca.' : 'Nenhum paciente cadastrado ainda.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Paciente</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Idade</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">CID</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Cadastro</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredPacientes.map((paciente) => (
                                    <tr key={paciente.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{paciente.nome}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{paciente.diagnostico || 'Sem diagnóstico'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{paciente.idade || '--'} anos</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                                                {paciente.cid || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(paciente.criado_em).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(paciente)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => window.location.href = `/relatorio?pacienteId=${paciente.id}`}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                    title="Gerar PTS"
                                                >
                                                    <FileText size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(paciente.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900">
                                {selectedPaciente ? 'Editar Paciente' : 'Novo Paciente'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Nome do paciente"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        value={formData.data_nascimento}
                                        onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CID</label>
                                    <input
                                        type="text"
                                        value={formData.cid}
                                        onChange={(e) => setFormData({ ...formData, cid: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Ex: F71.1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico Principal</label>
                                <textarea
                                    value={formData.diagnostico}
                                    onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                    placeholder="Descreva o diagnóstico..."
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-100 transition-all"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Separate component for X icon since Lucide imports need care in TS sometimes if not listed explicitly above
import { X } from 'lucide-react';
