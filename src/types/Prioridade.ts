import type {Types} from 'mongoose'

export type ClassificacaoPrioridade = 'PRIMARIA' | 'SECUNDARIA' | 'COMPLEMENTAR';

export interface Prioridade{
    _id: Types.ObjectId;
    nome:string;
    classificacao: ClassificacaoPrioridade;
    descricao?: string;
    ativa:boolean;
    createdAt: Date;
    updateAt: Date;
};


