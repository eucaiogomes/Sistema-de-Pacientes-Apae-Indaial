export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            usuarios: {
                Row: {
                    id: string
                    email: string
                    nome: string
                    role: 'admin' | 'operador'
                    criado_em: string
                    atualizado_em: string
                }
                Insert: {
                    id?: string
                    email: string
                    nome: string
                    role: 'admin' | 'operador'
                    criado_em?: string
                    atualizado_em?: string
                }
                Update: {
                    id?: string
                    email?: string
                    nome?: string
                    role?: 'admin' | 'operador'
                    criado_em?: string
                    atualizado_em?: string
                }
            }
            pacientes: {
                Row: {
                    id: string
                    nome: string
                    data_nascimento: string | null
                    idade: number | null
                    cid: string | null
                    diagnostico: string | null
                    usuario_id: string
                    criado_em: string
                    atualizado_em: string
                }
                Insert: {
                    id?: string
                    nome: string
                    data_nascimento?: string | null
                    idade?: number | null
                    cid?: string | null
                    diagnostico?: string | null
                    usuario_id: string
                    criado_em?: string
                    atualizado_em?: string
                }
                Update: {
                    id?: string
                    nome?: string
                    data_nascimento?: string | null
                    idade?: number | null
                    cid?: string | null
                    diagnostico?: string | null
                    usuario_id?: string
                    criado_em?: string
                    atualizado_em?: string
                }
            }
            pts: {
                Row: {
                    id: string
                    paciente_id: string
                    paciente_nome: string | null
                    paciente_idade: number | null
                    paciente_cid: string | null
                    paciente_diagnostico: string | null
                    data_criacao: string | null
                    profissional: string | null
                    medicamentos: string | null
                    area: string | null
                    periodo: string | null
                    descricao_caso: string | null
                    objetivos_gerais: string | null
                    objetivos_curto_prazo: string | null
                    objetivos_medio_prazo: string | null
                    objetivos_longo_prazo: string | null
                    responsabilidades_familia: string | null
                    atendimento_intersetorial: string | null
                    abordagem_escolar: string | null
                    encaminhamentos_internos: string | null
                    encaminhamentos_externos: string | null
                    assinatura_profissional: string | null
                    data_assinatura_prof: string | null
                    profissional_responsavel: string | null
                    carimbo: string | null
                    usuario_id: string
                    criado_em: string
                    atualizado_em: string
                }
                Insert: {
                    id?: string
                    paciente_id: string
                    paciente_nome?: string | null
                    paciente_idade?: number | null
                    paciente_cid?: string | null
                    paciente_diagnostico?: string | null
                    data_criacao?: string | null
                    profissional?: string | null
                    medicamentos?: string | null
                    area?: string | null
                    periodo?: string | null
                    descricao_caso?: string | null
                    objetivos_gerais?: string | null
                    objetivos_curto_prazo?: string | null
                    objetivos_medio_prazo?: string | null
                    objetivos_longo_prazo?: string | null
                    responsabilidades_familia?: string | null
                    atendimento_intersetorial?: string | null
                    abordagem_escolar?: string | null
                    encaminhamentos_internos?: string | null
                    encaminhamentos_externos?: string | null
                    assinatura_profissional?: string | null
                    data_assinatura_prof?: string | null
                    profissional_responsavel?: string | null
                    carimbo?: string | null
                    usuario_id: string
                    criado_em?: string
                    atualizado_em?: string
                }
                Update: {
                    id?: string
                    paciente_id?: string
                    paciente_nome?: string | null
                    paciente_idade?: number | null
                    paciente_cid?: string | null
                    paciente_diagnostico?: string | null
                    data_criacao?: string | null
                    profissional?: string | null
                    medicamentos?: string | null
                    area?: string | null
                    periodo?: string | null
                    descricao_caso?: string | null
                    objetivos_gerais?: string | null
                    objetivos_curto_prazo?: string | null
                    objetivos_medio_prazo?: string | null
                    objetivos_longo_prazo?: string | null
                    responsabilidades_familia?: string | null
                    atendimento_intersetorial?: string | null
                    abordagem_escolar?: string | null
                    encaminhamentos_internos?: string | null
                    encaminhamentos_externos?: string | null
                    assinatura_profissional?: string | null
                    data_assinatura_prof?: string | null
                    profissional_responsavel?: string | null
                    carimbo?: string | null
                    usuario_id?: string
                    criado_em?: string
                    atualizado_em?: string
                }
            }
        }
    }
}
