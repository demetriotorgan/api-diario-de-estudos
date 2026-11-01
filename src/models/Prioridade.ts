import { Schema, model } from "mongoose";
import type { Prioridade } from "../types/Prioridade.js";

const PrioridadeSchema = new Schema<Prioridade>({
    nome:{
        type:String,
        required:true,
        trim:true
    },
    classificacao:{
        type:String,
        required:true,
        enum:['PRIMARIA','SECUNDARIA', 'COMPLEMENTAR']
    },
    descricao:{
        type:String,
        trim:true
    },
    ativa:{
        type:Boolean,
        default:true
    }
    
},{
    timestamps:true,
    collection: 'prioridades'
});

export const PrioridadeModel = model<Prioridade>('Prioridade', PrioridadeSchema);