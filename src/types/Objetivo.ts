import type {Types} from 'mongoose'

export type StatusObjetivo = 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'CONCLUIDO';

export interface Objetivo {
    _id: Types.ObjectId;
    prioridadeId: Types.ObjectId;
    nome:string;
    descricao?: string;
    status: StatusObjetivo;
    createdAt: Date;
    updatedAt:Date;
}