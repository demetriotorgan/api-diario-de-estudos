import { Schema, model } from 'mongoose'
import type { RegistroExecucao } from '../types/RegistroExecucao.js'

const RegistroExecucaoSchema = new Schema<RegistroExecucao>({
    prioridadeId: {
        type: Schema.Types.ObjectId,
        ref: 'Prioridade',
        required: true,
        index: true
    },
    objetivoId: {
        type: Schema.Types.ObjectId,
        ref: 'Objetivo',
        required: true,
        index: true
    },
    data: {
        type: Date,
        required: true
    },
    atividade: {
        type: String,
        required: true,
        trim: true
    },
    duracaoMinutos: {
        type: Number,
        required: true,
        min:0          
    },
    statusExecucao: {
        type: String,
        required: true,
        enum: ['SEM_AVANCO', 'AVANCO_PEQUENO', 'AVANCO_SIGNIFICATIVO', 'CONCLUIDA']
    },
    score: {
        type: Number,
        required: true,
        enum: [0, 25, 60, 100]
    },
    esforco: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
            validator: (valor: number) => Number.isInteger(valor),
            message: 'O esforço deve ser um número inteiro'
        }
    },
    observacao: {
        type: String,
        trim: true
    }
},
    {
        timestamps: true,
        collection: 'registrosExecucao'
    }
);

RegistroExecucaoSchema.pre('validate', function () {
    const scores = {
        SEM_AVANCO: 0,
        AVANCO_PEQUENO: 25,
        AVANCO_SIGNIFICATIVO: 60,
        CONCLUIDA: 100
    } as const

    const scoreEsperado = scores[this.statusExecucao];

    if(scoreEsperado !== undefined && this.score !== scoreEsperado){
        this.invalidate('score', `O score deve ser ${scoreEsperado} para o status ${this.statusExecucao}`);
    }
});

export const RegistroExecucaoModel = model<RegistroExecucao>('RegistroExecucao', RegistroExecucaoSchema);

