import { ObjetivoModel } from "../models/Objetivo.js"

export const buscarObjetivoId = async(objetivoId:string, prioridadeId:string)=>{
    return await ObjetivoModel.findOne({
        _id:objetivoId,
        prioridadeId: prioridadeId
    })
}