'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import {
    FileDown,
    Printer,
    Save,
    ArrowLeft,
    ChevronDown,
    Info,
    CheckCircle,
    FileSpreadsheet
} from 'lucide-react';
import { Database } from '@/types/supabase';

type Paciente = Database['public']['Tables']['pacientes']['Row'];
type PTS = Database['public']['Tables']['pts']['Insert'];

function PTSFormContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pacienteId = searchParams.get('pacienteId');

    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // PTS Form State
    const [formData, setFormData] = useState<PTS>({
        paciente_id: pacienteId || '',
        profissional: '',
        medicamentos: '',
        area: 'Psicopedagogia',
        periodo: 'Matutino',
        descricao_caso: '',
        objetivos_gerais: '',
        objetivos_curto_prazo: '',
        objetivos_medio_prazo: '',
        objetivos_longo_prazo: '',
        responsabilidades_familia: '',
        atendimento_intersetorial: '',
        abordagem_escolar: '',
        encaminhamentos_internos: '',
        encaminhamentos_externos: '',
        profissional_responsavel: '',
        usuario_id: user?.id || '',
    });

    useEffect(() => {
        if (pacienteId) {
            fetchPaciente(pacienteId);
        }
    }, [pacienteId]);

    const fetchPaciente = async (id: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('pacientes')
            .select('*')
            .eq('id', id)
            .single();

        if (!error && data) {
            setPaciente(data);
            setFormData(prev => ({
                ...prev,
                paciente_nome: data.nome,
                paciente_idade: data.idade,
                paciente_cid: data.cid,
                paciente_diagnostico: data.diagnostico,
                paciente_id: data.id,
                usuario_id: user?.id || ''
            }));
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!user || !paciente) return;
        setSaving(true);

        try {
            const { data, error } = await supabase
                .from('pts')
                .insert([{
                    ...formData,
                    usuario_id: user.id,
                    data_assinatura_prof: new Date().toISOString().split('T')[0],
                }])
                .select()
                .single();

            if (error) throw error;

            alert('PTS salvo com sucesso!');
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar PTS.');
        } finally {
            setSaving(false);
        }
    };

    const areas = ['Psicopedagogia', 'Fisioterapia', 'Fonoaudiologia', 'Terapia Ocupacional', 'Serviço Social', 'Psicologia', 'Outro'];
    const periodos = ['Matutino', 'Vespertino', 'Integral', 'Turno Extendido'];

    if (loading) return <div className="p-12 text-center text-gray-400">Carregando dados do paciente...</div>;
    if (!paciente) return <div className="p-12 text-center text-red-500">Paciente não encontrado.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Voltar
                </button>

                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
                    >
                        {saving ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> : <Save size={18} />}
                        Salvar
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-sm transition-all">
                        <Printer size={18} />
                        PDF
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-sm transition-all">
                        <FileSpreadsheet size={18} />
                        Excel
                    </button>
                </div>
            </div>

            {/* PTS Document Area */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 sm:p-12">
                <div className="border-[3px] border-gray-800 p-8">
                    {/* Institution Header */}
                    <div className="text-center border-b-[3px] border-gray-800 pb-6 mb-8">
                        <h1 className="text-2xl font-black uppercase tracking-widest">Plano Terapêutico Singular</h1>
                        <h2 className="text-lg font-bold mt-2">APAE DE INDAIAL</h2>
                        <p className="text-sm text-gray-600 mt-1">Rua Rio de Janeiro, 443 | Bairro do Sol | 89130-000 | Indaial/SC</p>
                        <p className="text-sm text-gray-600">Fone: (47) 3333-0032 | CNPJ: 82.772.294/0001-34</p>
                    </div>

                    {/* Section 1: Identification */}
                    <section className="mb-8">
                        <div className="bg-gray-100 px-4 py-1 border-y border-gray-800 font-bold uppercase mb-4">
                            I. Identificação
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 px-4">
                            <div className="flex gap-2 border-b border-gray-200 pb-1">
                                <span className="font-bold min-w-[70px]">NOME:</span>
                                <span className="uppercase">{paciente.nome}</span>
                            </div>
                            <div className="flex gap-2 border-b border-gray-200 pb-1">
                                <span className="font-bold min-w-[70px]">IDADE:</span>
                                <span>{paciente.idade} anos</span>
                            </div>
                            <div className="flex gap-2 border-b border-gray-200 pb-1">
                                <span className="font-bold min-w-[70px]">CID:</span>
                                <span>{paciente.cid || '---'}</span>
                            </div>
                            <div className="flex gap-2 border-b border-gray-200 pb-1">
                                <span className="font-bold min-w-[120px]">DATA CRIAÇÃO:</span>
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="col-span-full flex gap-2 border-b border-gray-200 pb-1">
                                <span className="font-bold min-w-[120px]">DIAGNÓSTICO:</span>
                                <span>{paciente.diagnostico || 'Não informado'}</span>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Professional Treatment */}
                    <section className="mb-8">
                        <div className="bg-gray-100 px-4 py-1 border-y border-gray-800 font-bold uppercase mb-4">
                            II. Profissional / Tratamento
                        </div>
                        <div className="space-y-4 px-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Profissional Atendente</label>
                                    <input
                                        type="text"
                                        value={formData.profissional || ''}
                                        onChange={(e) => setFormData({ ...formData, profissional: e.target.value })}
                                        className="w-full border-b border-gray-300 py-1 outline-none focus:border-blue-500"
                                        placeholder="Nome do profissional"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Área</label>
                                        <select
                                            value={formData.area || ''}
                                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                            className="w-full border-b border-gray-300 py-1 outline-none bg-transparent"
                                        >
                                            {areas.map(a => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Período</label>
                                        <select
                                            value={formData.periodo || ''}
                                            onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                                            className="w-full border-b border-gray-300 py-1 outline-none bg-transparent"
                                        >
                                            {periodos.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Medicamentos em uso</label>
                                <input
                                    type="text"
                                    value={formData.medicamentos || ''}
                                    onChange={(e) => setFormData({ ...formData, medicamentos: e.target.value })}
                                    className="w-full border-b border-gray-300 py-1 outline-none focus:border-blue-500"
                                    placeholder="Liste os medicamentos ou 'Não faz uso'"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descrição do Caso (HDA/Queixa)</label>
                                <textarea
                                    value={formData.descricao_caso || ''}
                                    onChange={(e) => setFormData({ ...formData, descricao_caso: e.target.value })}
                                    className="w-full border border-gray-200 rounded p-2 mt-1 outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Objectives */}
                    <section className="mb-8">
                        <div className="bg-gray-100 px-4 py-1 border-y border-gray-800 font-bold uppercase mb-4">
                            III. Objetivos Terapêuticos
                        </div>
                        <div className="space-y-4 px-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Objetivo Geral</label>
                                <textarea
                                    value={formData.objetivos_gerais || ''}
                                    onChange={(e) => setFormData({ ...formData, objetivos_gerais: e.target.value })}
                                    className="w-full border border-gray-200 rounded p-2 mt-1 outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Curto Prazo</label>
                                    <textarea
                                        value={formData.objetivos_curto_prazo || ''}
                                        onChange={(e) => setFormData({ ...formData, objetivos_curto_prazo: e.target.value })}
                                        className="w-full border border-gray-200 rounded p-2 mt-1 outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Médio Prazo</label>
                                    <textarea
                                        value={formData.objetivos_medio_prazo || ''}
                                        onChange={(e) => setFormData({ ...formData, objetivos_medio_prazo: e.target.value })}
                                        className="w-full border border-gray-200 rounded p-2 mt-1 outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Longo Prazo</label>
                                    <textarea
                                        value={formData.objetivos_longo_prazo || ''}
                                        onChange={(e) => setFormData({ ...formData, objetivos_longo_prazo: e.target.value })}
                                        className="w-full border border-gray-200 rounded p-2 mt-1 outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Interventions */}
                    <section className="mb-8">
                        <div className="bg-gray-100 px-4 py-1 border-y border-gray-800 font-bold uppercase mb-4">
                            IV. Responsabilidades e Intervenções
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Responsabilidades com a Família</label>
                                <textarea
                                    value={formData.responsabilidades_familia || ''}
                                    onChange={(e) => setFormData({ ...formData, responsabilidades_familia: e.target.value })}
                                    className="w-full border border-gray-200 rounded p-2 mt-1 outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Abordagem Escolar</label>
                                <textarea
                                    value={formData.abordagem_escolar || ''}
                                    onChange={(e) => setFormData({ ...formData, abordagem_escolar: e.target.value })}
                                    className="w-full border border-gray-200 rounded p-2 mt-1 outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Encaminhamentos Internos</label>
                                <textarea
                                    value={formData.encaminhamentos_internos || ''}
                                    onChange={(e) => setFormData({ ...formData, encaminhamentos_internos: e.target.value })}
                                    className="w-full border border-gray-200 rounded p-2 mt-1 outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Encaminhamentos Externos</label>
                                <textarea
                                    value={formData.encaminhamentos_externos || ''}
                                    onChange={(e) => setFormData({ ...formData, encaminhamentos_externos: e.target.value })}
                                    className="w-full border border-gray-200 rounded p-2 mt-1 outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section 5: Signatures */}
                    <section className="mt-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 px-8">
                            <div className="text-center pt-8 border-t border-gray-800">
                                <p className="font-bold text-sm uppercase">{formData.profissional || '___________________________'}</p>
                                <p className="text-xs text-gray-500">Profissional Responsável</p>
                                <p className="text-xs text-gray-500 mt-1">Data: ___/___/2026</p>
                            </div>
                            <div className="text-center pt-8 border-t border-gray-800">
                                <p className="font-bold text-sm uppercase">APAE DE INDAIAL</p>
                                <p className="text-xs text-gray-500">Coordenação Pedagógica / Clínica</p>
                                <p className="text-xs text-gray-500 mt-1">Carimbo e Assinatura</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default function RelatorioPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <PTSFormContent />
        </Suspense>
    );
}
