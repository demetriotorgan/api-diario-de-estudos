import type {Types} from 'mongoose';

export type StatusExecucao = 'SEM_AVANCO' | 'AVANCO_PEQUENO' | 'AVANCO_SIGNIFICATIVO' | 'CONCLUIDA';

export type ScoreAvancado = 0 | 25 | 60 | 100;
export type ScoreEsforco = 1 | 2 | 3 | 4 |5;

export interface RegistroExecucao{
    _id: Types.ObjectId;

    //Relacionamentos
    prioridadeId: Types.ObjectId;
    objetivoId: Types.ObjectId;

    //Dados da execução
    data:Date;
    atividade:string;
    duracaoMinutos: number;

    //Avaliação de resultados
    statusExecucao: StatusExecucao;
    score: ScoreAvancado;
    esforco?:ScoreEsforco;

    //Informações complementares
    observacao?:String;

    //Controle documental
    createdAt: Date;
    updateAt:Date;
}