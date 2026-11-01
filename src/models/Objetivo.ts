import {Schema, model} from 'mongoose';
import type {Objetivo} from '../types/Objetivo.js';

const ObjetivoSchema = new Schema<Objetivo>({
    prioridadeId:{
        type: Schema.Types.ObjectId,
        ref: 'Prioridade',
        required:true,
        index:true
    },
    nome:{
        type:String,
        required: true,
        trim:true
    },
    descricao:{
        type:String,
        trim:true
    },
    status:{
        type:String,
        required:true,
        enum:['NAO_INICIADO', 'EM_ANDAMENTO', 'CONCLUIDO'],
        default:'NAO_INICIADO'
    }
},{
    timestamps:true,
    collection:'objetivos'
});

export const ObjetivoModel = model<Objetivo>('Objetivo', ObjetivoSchema);